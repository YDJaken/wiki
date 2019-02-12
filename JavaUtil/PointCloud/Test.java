package org.SpeedCloud.PointCloud;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class Test {
	
	public static void main(String[] args) {
		File f = new File("../PointCloud/lasData/3290_3300.las");
		try {
			FileInputStream fin = new FileInputStream(f);
			byte[] included = new byte[1024];
			fin.read(included);
			byte[] type = new byte[4];
			for(int i = 0;i<4;i++) {
				type[i] = included[i];
			}
			String FileType = new String(type,"UTF-8");
			short VersionMajor =  included[25];
			short VersionMinor =  included[26];
			Integer a = 132465;
			byte s = a.byteValue();
			byte[] ss = new byte[2];
			ss[0] = s;
			ss[1] = s;
			System.out.println(new String(ss,"UTF-8"));
			System.out.println(FileType+"版本:"+VersionMajor+"."+VersionMinor);
			fin.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
