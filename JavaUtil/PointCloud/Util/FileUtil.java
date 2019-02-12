package org.SpeedCloud.Util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.PriorityQueue;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class FileUtil {

	/**
	 * 将文件转换为字节 (大文件)
	 * 
	 * @param f
	 * @return
	 * @throws IOException
	 */
	public static PriorityQueue<MappedByteBuffer> toBytes(File f) throws IOException {
		long length = f.length();
		int max = Integer.MAX_VALUE;
		PriorityQueue<Integer> size = new PriorityQueue<>();
		while (length > max) {
			size.add(max);
			length -= max;
		}
		if (length < max) {
			size.add((int) length);
		}

		RandomAccessFile ra = new RandomAccessFile(f, "rw");
		FileChannel raf = ra.getChannel();

		PriorityQueue<MappedByteBuffer> ret = new PriorityQueue<MappedByteBuffer>();
		long startPosition = 0;
		while (!size.isEmpty()) {
			int endPosition = size.remove() - 1;
			raf.tryLock(startPosition, endPosition, false);
			ret.add(raf.map(FileChannel.MapMode.READ_WRITE, startPosition, endPosition));
			startPosition += max;
		}
		raf.close();
		ra.close();
		return ret;
	}
	/**
	 * 将文件转换为字节 (小文件)
	 * 
	 * @param f
	 * @return
	 * @throws IOException
	 */
	public static PriorityQueue<byte[]> toBytesSafe(File f) throws Exception {
		long length = f.length();
		int max = Integer.MAX_VALUE;
		if ((length - max) > max) {
			throw new Exception("文件过大");
		}
		int[] size = new int[2];
		if (length < max) {
			size[0] = (int) length;
		} else {
			size[0] = max;
			size[1] = (int) (length - max);
		}
		RandomAccessFile ra = new RandomAccessFile(f, "r");
		PriorityQueue<byte[]> ret = new PriorityQueue<byte[]>();
		int startPosition = 0;
		if (size[1] == 0) {
			byte[] b = new byte[size[0]];
			ra.read(b);
			ret.add(b);
		} else {
			byte[] b = new byte[size[0]];
			int endPosition = size[0] - 1;
			ra.readFully(b, startPosition, endPosition);
			ret.add(b);
			startPosition += max;
			endPosition = size[1];
			ra.readFully(b, startPosition, endPosition);
			ret.add(b);
		}
		ra.close();
		return ret;
	}

	public static boolean unGzipFile(File sourcedir, File f) {
		boolean ret = false;
		if (!f.exists()) {
			try {
				f.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				ret = true;
			}
			if (ret == true)
				return false;
		}
		try {
			FileInputStream fin = new FileInputStream(sourcedir);
			GZIPInputStream gzin = new GZIPInputStream(fin);
			FileOutputStream fout = new FileOutputStream(f);
			int num;
			byte[] buf = new byte[1024];
			while ((num = gzin.read(buf, 0, buf.length)) != -1) {
				fout.write(buf, 0, num);
			}
			gzin.close();
			fout.close();
			fin.close();
			return true;
		} catch (Exception e) {
			System.err.println(e.toString());
			// e.printStackTrace();
		}
		return false;
	}

	public static void unZip(File zfile) throws IOException {
		String Parent = zfile.getParent() + File.separator;
		FileInputStream fis = new FileInputStream(zfile);
		ZipInputStream zis = new ZipInputStream(fis);
		ZipEntry entry = null;
		BufferedOutputStream bos = null;
		while ((entry = zis.getNextEntry()) != null) {
			if (entry.isDirectory()) {
				File filePath = new File(Parent + entry.getName());
				if (!filePath.exists()) {
					filePath.mkdirs();
				}
			} else {
				FileOutputStream fos = new FileOutputStream(Parent + entry.getName());
				bos = new BufferedOutputStream(fos);
				byte buf[] = new byte[1024];
				int len;
				while ((len = zis.read(buf)) != -1) {
					bos.write(buf, 0, len);
				}
				zis.closeEntry();
				bos.close();
			}
		}
		zis.close();
	}

	public static int index(String path) {
		int ret = -1;
		for (int i = path.length() - 1 - 5; i > 0; i--) {
			if (path.charAt(i) == File.separatorChar) {
				return i;
			}
		}
		return ret;
	}

	public static void moveFile(File file1, File file2) {
		FileOutputStream fileOutputStream = null;
		InputStream inputStream = null;
		byte[] bytes = new byte[1024];
		int temp = 0;
		try {
			inputStream = new FileInputStream(file1);
			fileOutputStream = new FileOutputStream(file2);
			while ((temp = inputStream.read(bytes)) != -1) {
				fileOutputStream.write(bytes, 0, temp);
				fileOutputStream.flush();
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					System.err.println(e.toString());
					// e.printStackTrace();
				}
			}
			if (fileOutputStream != null) {
				try {
					fileOutputStream.close();
				} catch (IOException e) {
					System.err.println(e.toString());
					// e.printStackTrace();
				}
			}
		}

	}

	public static void cutFile(String origin, String destnation) {
		File a = new File(origin);
		File b = new File(destnation);
		if (a.exists()) {
			if (!b.exists()) {
				try {
					b.createNewFile();
				} catch (IOException e) {
					System.err.println(e.toString());
				}
			}
			moveFile(a, b);
			a.delete();
		}
	}

	public static void moveFile(String origin, String destnation) {
		File a = new File(origin);
		File b = new File(destnation);
		if (a.exists()) {
			if (!b.exists()) {
				try {
					b.createNewFile();
				} catch (IOException e) {
					System.err.println(e.toString());
				}
			}
			moveFile(a, b);
		}
	}
}
