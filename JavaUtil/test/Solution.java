package test;

import java.util.HashMap;
import java.util.Map;

class Solution {

	public boolean isMatch(String s, String p) {
		int m = s.length();
		int n = p.length();
		boolean[][] dp = new boolean[m + 1][n + 1];

		dp[0][0] = true;
		for (int i = 1; i <= n; i++) {
			if (p.charAt(i - 1) == '*') {
				dp[0][i] = dp[0][i - 2];
			}
		}

		char[] str = s.toCharArray();
		char[] patt = p.toCharArray();

		for (int i = 1; i <= m; i++) {
			for (int j = 1; j <= n; j++) {
				if (patt[j - 1] == '.' || str[i - 1] == patt[j - 1]) {
					dp[i][j] = dp[i - 1][j - 1];
				} else {
					if (patt[j - 1] == '*') {
						dp[i][j] = dp[i][j - 2];
						if (patt[j - 2] == str[i - 1] || patt[j - 2] == '.') {
							dp[i][j] = dp[i][j] || dp[i - 1][j];
						}
					}
				}
			}
		}
		return dp[m][n];
	}

	public int maxArea(int[] height) {
		int maxArea = 0, start = 0, end = height.length - 1;
		while (start < end) {
			maxArea = Math.max(maxArea, Math.min(height[start], height[end]) * (end - start));
			if (height[start] > height[end]) {
				end--;
			} else {
				start++;
			}
		}
		return maxArea;
	}

	public int[] twoSum(int[] nums, int target) {
		Map<Integer, Integer> map = new HashMap<>();
		for (int i = 0; i < nums.length; i++) {
			int n = target - nums[i];
			if (map.containsKey(n)) {
				return new int[] { map.get(n), i };
			}
			map.put(nums[i], i);
		}
		throw new IllegalArgumentException("No solution");

	}

	public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
		if (l1 == null && l2 == null) {
			return null;
		}
		int sum = 0;
		int u = 0;
		ListNode l3 = new ListNode(0);
		ListNode l4 = l3;
		int a = 0;
		int b = 0;
		while (l1 != null || l2 != null) {
			a = 0;
			b = 0;
			if (l1 != null) {
				a = l1.val;
				l1 = l1.next;
			}
			if (l2 != null) {
				b = l2.val;
				l2 = l2.next;
			}
			sum = a + b + u;
			u = sum / 10;
			sum = sum % 10;
			l4.next = new ListNode(sum);
			l4 = l4.next;
		}
		if (u == 1) {
			l4.next = new ListNode(1);
		}
		return l3.next;
	}

	public class ListNode {
		int val;
		ListNode next;

		ListNode(int x) {
			val = x;
		}
	}

	public int lengthOfLongestSubstring(String s) {
		if (s.length() < 2)
			return s.length();
		// 利用ascII 编码位置来计算最长子字符串
		boolean[] ascII = new boolean[128];
		char[] c = s.toCharArray();
		int start = 0;
		ascII[c[start]] = true;
		int max = 1;
		for (int i = 1; i < c.length; ++i) {
			if (ascII[c[i]]) {
				while (c[start] != c[i]) {
					ascII[c[start]] = false;
					++start;
				}
				++start;
			} else {
				ascII[c[i]] = true;
			}
			max = Math.max(max, i - start + 1);
		}
		return max;
	}

	public String convert(String s, int numRows) {
		int sl = s.length();
		if (s == null || numRows <= 1 || sl <= numRows)
			return s;
		int totalRows = numRows * 2 - 2, position = 0;
		String[] ss = new String[numRows];
		for (int i = 0; i < numRows; i++) {
			ss[i] = s.charAt(i) + "";
		}
		for (int i = numRows, j = 0; i < sl; i++) {
			j = i % totalRows;
			if (j < numRows) {
				ss[j] = ss[j] + s.charAt(i);
			} else {
				position = 2 * numRows - j - 2;
				ss[position] = ss[position] + s.charAt(i);
			}
			j++;
		}
		String re = ss[0];
		for (int i = 1; i < numRows; i++) {
			re = re + ss[i];
		}
		return re;
	}
}
