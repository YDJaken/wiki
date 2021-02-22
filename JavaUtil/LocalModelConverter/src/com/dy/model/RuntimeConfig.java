package com.dy.model;

import java.util.HashMap;

public class RuntimeConfig {

	private HashMap<String, String> systemConfig = new HashMap<>();

	private static RuntimeConfig instance;

	// ʹ��˫��У������ʽʵ�ֵ���
	public static RuntimeConfig getInstance() {
		if (instance == null) {
			synchronized (RuntimeConfig.class) {
				if (instance == null) {
					instance = new RuntimeConfig();
				}
			}
		}
		return instance;
	}

	// ��ֹ���л��ƻ�����ģʽ
	private Object readResolve() {
		return instance;
	}

	public int size() {
		return this.systemConfig.size();
	}
	
	public void addConfig(String environment, String path) {
		this.systemConfig.put(environment, path);
	}

	public String loadConfig(String environment) throws RuntimeException {
		String ret = this.systemConfig.get(environment);
		if (ret == null) {
			throw new RuntimeException(environment + " is not defined in this system.");
		}
		return ret;
	}
}
