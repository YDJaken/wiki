package com.dy.model;

import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

public class RunJobThread extends Thread {

	// 每五秒查询一次状态
	static final short WAIT_TIME = 5;
	public String errorMSG;
	private long processTime = 0;
	private modelJob job;

	public RunJobThread(modelJob job) {
		this.job = job;
	}

	public boolean compareRequest(HttpServletRequest request) {
		return this.job.compareRequest(request);
	}
	
	private boolean started = false;

	public boolean stillRun() {
		return this.started;
	}

	public void stopJob() {
		this.started = false;
	}

	@Override
	public synchronized void start() {
		super.start();
		this.started = true;
		processTime = 0;
	}

	public String loadProcessTime() {
		return Math.floor(processTime / 60) + "分钟";
	}

	@Override
	public void run() {
		super.run();
		try {
			Process proc = this.job.exec();
			while (!proc.waitFor(WAIT_TIME, TimeUnit.SECONDS)) {
				if (!this.started) {
					proc.destroyForcibly();
					proc.waitFor();
				} else {
					processTime += WAIT_TIME;
				}
			}
			int exit = proc.exitValue();
			if (exit != 0) {
				StringBuilder sb = new StringBuilder();
				sb.append(new String(proc.getErrorStream().readAllBytes()));
				sb.append(new String(proc.getInputStream().readAllBytes()));
				errorMSG = sb.toString();
				this.job.stop();
			}
		} catch (Exception e) {
			e.printStackTrace();
			if (this.job != null) {
				errorMSG = e.getMessage();
				this.job.stop();
			}
		}finally {
			synchronized(this) {
				this.notifyAll();	
			}
		}
	}
}