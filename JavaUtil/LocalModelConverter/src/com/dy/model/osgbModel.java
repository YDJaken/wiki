package com.dy.model;

import java.lang.reflect.Field;
import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;
import com.dy.Util.ServletUtil;

public class osgbModel extends modelJob {

	public osgbModel() {
		super();
		EXEName = "osgb2tiles4.exe";
	}

	// SRS
	protected String srsString;
	// 线程数
	protected int threadCount;
	// 强制双面
	protected boolean doubleside;
	// 无光照
	protected boolean nolight;
	// 重建顶层
	protected boolean mergeTop;
	// 顶点压缩
	protected boolean dracoCompression;
	// 纹理压缩 webp 减小总量 crn 综合优化 "" 默认
	protected String textureFormat;

	@Override
	public String loadConfigJSON() {
		JSONObject root = new JSONObject();
		JSONObject inputs = new JSONObject();
		inputs.put("path", inputPath);
		inputs.put("in_srs", "ENU:" + srsString);
		inputs.put("srsorigin", "0,0,0");
		root.put("input", inputs);
		root.put("threadCount", threadCount);
		root.put("reverseTriangle", false);
		root.put("fullTree", true);
		root.put("skipPerTile", false);
		root.put("mergeTop", mergeTop);
		root.put("bingmapIndex", false);
		JSONObject output = new JSONObject();
		output.put("path", outputPath);
		output.put("type", "file");
		root.put("output", output);
		JSONObject D3dtiles = new JSONObject();
		JSONObject b3dm = new JSONObject();
		b3dm.put("doubleSided", doubleside);
		b3dm.put("nolight", nolight);
		b3dm.put("dracoCompression", dracoCompression);
		JSONObject textureCompression = new JSONObject();
		textureCompression.put("scale", 1);
		textureCompression.put("format", textureFormat);
		D3dtiles.put("b3dm", b3dm);
		root.put("3dtiles", D3dtiles);
		root.put("delete", delete);
		JSONObject auth = new JSONObject();
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
		return "osgbModelCon";
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
		threadCount = Integer.parseInt((String) ServletUtil.getRequestParameter(request, "threadCount", 0));
		dracoCompression = Boolean
				.parseBoolean((String) ServletUtil.getRequestParameter(request, "dracoCompression", true));
		nolight = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "nolight", true));
		doubleside = Boolean.parseBoolean((String) ServletUtil.getRequestParameter(request, "doubleside", false));
		mergeTop = Boolean
				.parseBoolean((String) ServletUtil.getRequestParameter(request, "mergeTop", false));
	}

	@Override
	public boolean compareRequest(HttpServletRequest request) {
		boolean ret = super.compareRequest(request);
		if (!ret) {
			return ret;
		}
		Class<? extends osgbModel> cls = this.getClass();
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
