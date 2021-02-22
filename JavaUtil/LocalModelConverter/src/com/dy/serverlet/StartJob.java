package com.dy.serverlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.dy.model.RunJobThread;
import com.dy.model.modelJob;

/**
 * Servlet implementation class StartJob
 */
@WebServlet("/StartJob/*")
public class StartJob extends HttpServlet {
	public static final LinkedList<RunJobThread> processJob = new LinkedList<RunJobThread>();
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public StartJob() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		RunJobThread thread;
		PrintWriter out = response.getWriter();
		synchronized (StartJob.class) {
			int[] find = new int[1];
			StartJob.processJob.forEach((threadx) -> {
				if (threadx.compareRequest(request)) {
					find[0]++;
				}
			});
			if (find[0] != 0) {
				out.append("200");
				out.flush();
				return;
			}
			modelJob job;
			try {
				job = modelJob.loadReqeust(request);
			} catch (IllegalArgumentException e) {
				response.setStatus(500);
				out.append(e.getMessage());
				out.flush();
				return;
			}
			thread = new RunJobThread(job);
			processJob.add(thread);
		}

		thread.start();
		synchronized (thread) {
			try {
				thread.wait();
				if (thread.errorMSG != null) {
					out.append(thread.errorMSG);
					out.flush();
					processJob.remove(thread);
					return;
				} else {
					out.append("200");
					out.flush();
					processJob.remove(thread);
					return;
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}
