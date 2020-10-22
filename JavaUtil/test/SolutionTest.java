package test;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class SolutionTest {


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
