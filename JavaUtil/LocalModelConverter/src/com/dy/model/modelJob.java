package com.dy.model;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.dy.Util.FileUtil;
import com.dy.Util.HttpRequestUtil;
import com.dy.Util.ServletUtil;

class setUp extends TimerTask {

	@Override
	public void run() {
		modelJob.updateLic();
	}
}

public abstract class modelJob {
	private static final long WAIT_TIME = 1000 * 60 * 60 * 7;
	private static final Timer timer = new Timer(true);

	private String ID = UUID.randomUUID().toString().replaceAll("-", "");
	protected String EXEName;
	

	protected String configFilePath = null;
	protected String inputPath;
	protected String outputPath;

	protected static RuntimeConfig config = RuntimeConfig.getInstance();
	protected static String userID;
	protected static String hackServerURL;
	protected static String Cookie = "JSESSIONID=3101369359340136270; Path=/";
	protected static boolean delete = false;
	private static String webBase = null;
	private static Process hackProc = null;
	private static ReadLogThread logTh = null;

	public static final modelJob loadReqeust(HttpServletRequest request) throws IllegalArgumentException {
		String type = (String) ServletUtil.getRequestParameter(request, "type", "");
		modelJob ret;
		switch (type) {
		case "obj":
			ret = new ObjModel();
			break;
		case "fbx":
			ret = new FbxModel();
			break;
		case "osgb":
			ret = new osgbModel();
			break;
		default:
			throw new IllegalArgumentException("请求体类型配置有误:" + type);
		}
		
		ret.fromRequest(request);
		return ret;
	}

	public synchronized static final void init() {
		if (hackProc != null) {
			return;
		}
		if (webBase == null) {
			String base = modelJob.class.getResource("/").getPath();
			webBase = new File(base).getParent();
		}
		timer.schedule(new setUp(), new Date(), WAIT_TIME);
		loadConfig();
		modelJob.runHackServer();
	}

	public static final void updateLic() {
		System.out.println("---------开始获取授权---------");
		File lic = new File(webBase + "\\lab2.lic");
		if (lic.exists()) {
//			long now = new Date().getTime();
//			now -= lic.lastModified();
//			if (now > WAIT_TIME) {
			Cookie = HttpRequestUtil.getToken();
			byte[] bytes = HttpRequestUtil.redriect("http://lab2.cesiumlab.com/api/user/toolauth/download", null, Cookie, 0);
			FileUtil.writeBytes(lic,bytes);
			String[] tmpS = Cookie.split(";");
			File tmp = new File("E:\\lisence\\"+tmpS[0]+"lab2.lic");
			if(!tmp.exists()) {
				File dir = new File("E:\\lisence");
				dir.mkdirs();
				try {
					tmp.createNewFile();
					FileUtil.writeBytes(tmp,bytes);
				} catch (IOException e) {
					System.out.println("备份lic失败。");
				}
			}
			
			lic.setLastModified(new Date().getTime());
//			}
		}
		System.out.println("---------获取授权结束---------");
	}

	public static final void destroy() {
		timer.purge();
		if (hackProc == null) {
			return;
		} else {
			try {
				hackProc.destroyForcibly();
				hackProc.waitFor();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			hackProc = null;
		}
	}

	private static final void loadConfig() {
		JSONObject obj = JSON.parseObject(FileUtil.readString(new File(webBase + "\\config.json")));
		obj.keySet().forEach((e) -> {
			config.addConfig(e, obj.get(e).toString());
		});
	}

	private static final void runHackServer() {
		if (config.loadConfig("exePath").equals("dynamic")) {
			config.addConfig("exePath", webBase + "\\tools\\");
		}
		hackServerURL = "http://localhost:" + config.loadConfig("serverProt") + "/api";
		userID = config.loadConfig("userID");
		String serverPath = '"' + webBase + "\\server.exe \" " + config.loadConfig("serverProt") + " \"" + webBase
				+ "\\lab2.lic" + '"';
		try {
			hackProc = Runtime.getRuntime().exec(serverPath);
			logTh = new ReadLogThread(hackProc);
			logTh.start();
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("认证服务器运行失败,请检查端口情况。");
		}
	}

	public abstract String loadConfigJSON();

	public abstract String loadJobName();

	public abstract String loadJobProperty();

	public void deleteTrash() {
		File outputPathf = new File(outputPath);
		if (!outputPathf.exists()) {
			return;
		}
		if (outputPathf.isDirectory()) {
			File[] subFiles = outputPathf.listFiles();
			for (int i = 0; i < subFiles.length; i++) {
				try {
					FileUtil.deleteFile(subFiles[i]);
				} catch (Exception e) {
				}
			}
		}
	}

	public void fromRequest(HttpServletRequest request) throws IllegalArgumentException {
		inputPath = (String) ServletUtil.getRequestParameter(request, "inputPath");
		outputPath = (String) ServletUtil.getRequestParameter(request, "outputPath");
		if (inputPath == null || outputPath == null) {
			throw new IllegalArgumentException("请求体目录配置有误");
		}
	}

	public boolean compareRequest(HttpServletRequest request) {
		String inputPath = (String) ServletUtil.getRequestParameter(request, "inputPath");
		if (!inputPath.equals(this.inputPath)) {
			return false;
		}
		String outputPath = (String) ServletUtil.getRequestParameter(request, "outputPath");
		if (!outputPath.equals(this.outputPath)) {
			return false;
		}
		return true;
	}

	public String buildCMD() {
		if (configFilePath != null) {
			this.clean();
		}
		String jobName = this.loadJobName();
		configFilePath = outputPath + "\\" + jobName + ID + ".json";
		File jobConfig = new File(configFilePath);
		try {
			if (!jobConfig.exists()) {
				jobConfig.createNewFile();
			}
			FileUtil.writeString(jobConfig, this.loadConfigJSON());
			StringBuilder sb = new StringBuilder();
			sb.append('"');
			sb.append(config.loadConfig("exePath") + EXEName);
			sb.append('"');
			sb.append(" ");
			sb.append(this.loadJobProperty());
			return sb.toString();
		} catch (IOException e) {
			e.printStackTrace();
			return "";
		}
	}

	public Process exec() throws IOException {
		return Runtime.getRuntime().exec(this.buildCMD());
	}

	public void clean() {
		if (configFilePath != null) {
			return;
		}
		File jobConfig = new File(configFilePath);
		jobConfig.deleteOnExit();
		configFilePath = null;
	}

	public void stop() {
		this.clean();
		this.deleteTrash();
	}
}
