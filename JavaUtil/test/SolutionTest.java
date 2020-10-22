package test;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class SolutionTest {

class LogSystem {
    private HashMap<String, Integer> map;
    public LogSystem() {
        this.map = new HashMap<>();
    }
    
    public void put(int id, String timestamp) {
        this.map.put(timestamp,id);
    }
    
    public List<Integer> retrieve(String s, String e, String gra) {
        List<Integer> ret =  new LinkedList<>();
        int length = 0;
        if(gra.equals("Year")){
            length = 4;
        }else if (gra.equals("Month")){
            length = 7;
        }else if (gra.equals("Day")){
            length = 10;
        }else if (gra.equals("Hour")){
            length = 13;
        }else if (gra.equals("Minute")){
            length = 18;
        }else if (gra.equals("Second")){
            length = 19;
        }
        String startStr = s.substring(0,length);
        String endStr = e.substring(0,length);
        for(Map.Entry<String,Integer> entry : this.map.entrySet()){
            String tmpStr = entry.getKey().substring(0,length);
            if(tmpStr.compareTo(startStr)<0){
                continue;
            }
            if(tmpStr.compareTo(endStr)>0){
                continue;
            }
            ret.add(entry.getValue());
        }
        return ret;
    }
}


	@Test
	void testMatch() {
		assertEquals(new Solution().isMatch("aaasassss", "a.*sas*"), true);
		assertEquals(new Solution().isMatch("aasssbbbb", "a.*b"), true);
		assertEquals(new Solution().isMatch("aaa", "ab*a"), false);
		assertEquals(new Solution().isMatch("abcd", "d*"), false);
		assertEquals(new Solution().isMatch("aab", "c*a*b"), true);
		assertEquals(new Solution().isMatch("aa", "a"), false);
		assertEquals(new Solution().isMatch("aa", "a*"), true);
		assertEquals(new Solution().isMatch("ab", ".*"), true);
		assertEquals(new Solution().isMatch("ab", ".*c"), false);
		assertEquals(new Solution().isMatch("abc", ".*c"), true);
		assertEquals(new Solution().isMatch("abc", "c.*"), false);
		assertEquals(new Solution().isMatch("abcc", ".*cd*c"), true);
		assertEquals(new Solution().isMatch("abcc", ".*c*d*c"), true);
		assertEquals(new Solution().isMatch("abcc", ".*c*d*ccc"), false);
		assertEquals(new Solution().isMatch("aadc", "ca*d*"), false);
		assertEquals(new Solution().isMatch("mississippi", "mis*is*p*."), false);
		assertEquals(new Solution().isMatch("mississippi", "mis*is*ip*."), true);
		assertEquals(new Solution().isMatch("mississippiiiiii", "mis*is*ip*.*"), true);
		assertEquals(new Solution().isMatch("mississippiiiiii", "mis*is*ip*i*"), true);
		assertEquals(new Solution().isMatch("mississippiiiiii", "mis*is*ip*i"), false);
	}
	
	@Test
	void testArea() {
		assertEquals(new Solution().maxArea(new int[]{1,8,6,2,5,4,8,3,7}), 49);
	}

}
