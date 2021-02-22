package com.dy.model;

import java.io.InputStream;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class ReadLogThread extends Thread {

	private Process proc;

	public ReadLogThread(Process proc) {
		this.proc = proc;
	}

	@Override
	public void run() {
		super.run();
		if (this.proc == null || !this.proc.isAlive()) {
			return;
		}
		try {
			InputStream is = this.proc.getInputStream();
			InputStream es = this.proc.getErrorStream();
			StringBuilder sb = new StringBuilder();
			while (this.proc.isAlive()) {
				this.proc.waitFor(RunJobThread.WAIT_TIME, TimeUnit.SECONDS);
				int length = is.available();
				if (length > 0) {
					sb.append(new Date().toString());
					sb.append(System.lineSeparator());
					byte[] byts = new byte[length];
					is.read(byts);
					sb.append(new String(byts));
				}
				length = es.available();
				if (length > 0) {
					sb.append(new Date().toString());
					sb.append(System.lineSeparator());
					byte[] byts = new byte[length];
					sb.append("error:");
					es.read(byts);
					sb.append(new String(byts));
				}
				if (sb.length() > 0) {
					System.out.println(sb.toString());
					sb.setLength(0);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}
	}
}