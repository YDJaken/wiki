package com.dy.model;

import java.lang.reflect.Field;
import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dy.Util.ServletUtil;

public class ObjModel extends modelJob {

	public ObjModel() {
		super();
		EXEName = "model2tiles.exe";
	}

	// SRS
	protected String srsString;
	// 最小层级
	protected int minZoom;
	// 最大层级
	protected int maxZoom;
	// 线程数
	protected int threadCount;
	// 三角网简化
	protected boolean simplify;
	// 纹理重计算
	protected boolean textureproj;
	// 强制双面
	protected boolean doubleside;
	// 无光照
	protected boolean nolight;
	// 开启Lod
	protected boolean lod;
	// 外壳精简
	protected boolean recon;
	// 顶点压缩
	protected boolean dracoCompression;
	// 纹理合并
	protected boolean mergeRepeat;
	// 纹理压缩 webp 减小总量 crn 综合优化 "" 默认
	protected String textureFormat;

	@Override
	public String loadConfigJSON() {
		JSONObject root = new JSONObject();
		JSONObject database = new JSONObject();
		database.put("skipImport", false);
		JSONObject sqlite = new JSONObject();
		sqlite.put("file", "");
		database.put("sqlite", sqlite);
		root.put("database", database);
		JSONArray inputsA = new JSONArray();
		JSONObject inputs = new JSONObject();
		JSONArray files = new JSONArray();
		files.add(inputPath);
		inputs.put("files", files);
		inputs.put("name", "");
		inputs.put("srs", "ENU:" + srsString);
		inputs.put("srsorigin", "0,0,0");
		inputs.put("encodeGBK", true);
		inputs.put("flipYZ", true);
		inputs.put("props", "");
		inputs.put("type", "OBJ");
		inputsA.add(inputs);
		root.put("inputs", inputsA);
		JSONObject lod = new JSONObject();
		lod.put("minZoom", minZoom);
		lod.put("maxZoom", maxZoom);
		lod.put("threadCount", threadCount);
		JSONObject recon = new JSONObject();
		recon.put("enable", this.recon);
		recon.put("render", "opengl");
		lod.put("recon", recon);
		root.put("lod", lod);
		JSONObject filters = new JSONObject();
		JSONObject simplify = new JSONObject();
		simplify.put("exclude", this.simplify);
		JSONObject textureproj = new JSONObject();
		textureproj.put("exclude", this.textureproj);
		JSONObject doubleside = new JSONObject();
		doubleside.put("include", this.doubleside);
		JSONObject nolight = new JSONObject();
		nolight.put("include", this.nolight);
		lod = new JSONObject();
		lod.put("exclude", !this.lod);
		filters.put("simplify", simplify);
		filters.put("textureproj", textureproj);
		filters.put("doubleside", doubleside);
		filters.put("nolight", nolight);
		filters.put("lod", lod);
		root.put("filters", filters);
		root.put("dracoCompression", dracoCompression);
		root.put("mergeRepeat", mergeRepeat);
		root.put("textureFormat", textureFormat);
		root.put("modelname", false);
		root.put("firstsrs", false);
		root.put("delete", delete);
		root.put("props", new JSONArray());
		JSONObject output = new JSONObject();
		output.put("path", outputPath);
		output.put("type", "file");
		root.put("output", output);
		JSONObject auth = new JSONObject();
//		auth.put("file", "C:\\Users\\Administrator\\.cesiumlab\\cesiumlab2.lic");
		JSONObject online = new JSONObject();
		online.put("version", 2);
		online.put("server", hackServerURL);
		online.put("userid", userID);
		online.put("session", Cookie);
		auth.put("online", online);
		root.put("auth", auth);
		return root.toJSONString();
	}

	@Override
	public String loadJobName() {
		return "ObjModelCon";
	}

	@Override
	public String loadJobProperty() {
		StringBuilder sb = new StringBuilder();
		sb.append(" --task \"");
		sb.append(configFilePath);
		sb.append('"');
		sb.append(" --taskserver ");
		sb.append("tcp://127.0.0.1:9001");
		sb.append(" --taskname ");
		sb.append(this.loadJobName());
		sb.append(" --log_dir ");
		sb.append('"');
		sb.append(outputPath);
		sb.append('"');
		return sb.toString();
	}

	@Override
	public void fromRequest(HttpServletRequest request) throws IllegalArgumentException {
		super.fromRequest(request);
		srsString = (String) ServletUtil.getRequestParameter(request, "srsString", "39.90691,116.39123");
		textureFormat = (String) ServletUtil.getRequestParameter(request, "textureFormat", "webp");
		minZoom = Integer.parseInt((String) ServletUtil.getRequestParameter(request, "minZoom", 16));
		maxZoom = Integer.parseInt((String) ServletUtil.getRequestParameter(request, "maxZoom", 20));
		threadCount = Integer.parseInt((String) ServletUtil.getRequestParameter(request, "threadCount", 2));
		recon = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "recon", false));
		dracoCompression = Boolean
				.parseBoolean((String) ServletUtil.getRequestParameter(request, "dracoCompression", true));
		mergeRepeat = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "mergeRepeat", true));
		nolight = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "nolight", true));
		doubleside = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "doubleside", false));
		lod = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "lod", true));
		textureproj = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "textureproj", false));
		simplify = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "simplify", true));
	}

	@Override
	public boolean compareRequest(HttpServletRequest request) {
		boolean ret = super.compareRequest(request);
		if (!ret) {
			return ret;
		}
		Class<? extends ObjModel> cls = this.getClass();
		Field[] fs = cls.getDeclaredFields();
		for (int i = 0; i < fs.length; i++) {
			Field fi = fs[i];
			if (fi.toString().indexOf("protected") != -1) {
				String name = fi.getName();
				fi.setAccessible(true);
				try {
					Object cmp = fi.get(this);
					Object net = ServletUtil.getRequestParameter(request, name);
					if (net != null) {
						if (cmp instanceof Integer) {
							net = Integer.parseInt(net.toString());
						} else if (cmp instanceof Boolean) {
							net = Boolean.parseBoolean(net.toString());
						} else if (cmp instanceof Long) {
							net = Long.parseLong(net.toString());
						}
					}

					if (!cmp.equals(net)) {
						return false;
					}
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				}

			}
		}
		return ret;
	}
}
