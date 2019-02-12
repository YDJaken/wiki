package org.SpeedCloud.PointCloud;

import java.util.HashMap;

public class PublicResource {
	@SuppressWarnings("serial")
	public static final HashMap<String,String> CtoJava_Number = new HashMap<String,String>(){{
		put("I1","short");
		put("I2","short");
		put("I4","int");
		put("I8","long");
		put("R4","folat");
		put("R8","double");
		put("R10","NOTSUPPORTED");
		put("UI1","short");
		put("UI2","int");
		put("UI4","long");
		put("UI8","BigInteger");
		put("BF1","Byte1");
		put("BF2","Byte2");
		put("BF4","Byte4");
		put("BF8","Byte8");
	}};
}
