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

/*
	 * 有效括号字符串 定义：对于每个左括号，都能找到与之对应的右括号，反之亦然。详情参见题末「有效括号字符串」部分。
	 *
	 * 嵌套深度 depth 定义：即有效括号字符串嵌套的层数，depth(A) 表示有效括号字符串 A 的嵌套深度。详情参见题末「嵌套深度」部分。
	 *
	 * 给你一个「有效括号字符串」 seq，请你将其分成两个不相交的有效括号字符串，A 和 B，并使这两个字符串的深度最小。
	 *
	 * 不相交：每个 seq[i] 只能分给 A 和 B 二者中的一个，不能既属于 A 也属于 B 。 A 或 B 中的元素在原字符串中可以不连续。
	 * A.length + B.length = seq.length 深度最小：max(depth(A), depth(B)) 的可能取值最小。 
	 * 划分方案用一个长度为 seq.length 的答案数组 answer 表示，编码规则如下：
	 *
	 * answer[i] = 0，seq[i] 分给 A 。 answer[i] = 1，seq[i] 分给 B 。
	 * 如果存在多个满足要求的答案，只需返回其中任意 一个 即可。
	 *
	 *  
	 *
	 * 示例 1：
	 *
	 * 输入：seq = "(()())" 输出：[0,1,1,1,1,0]
	 *
	 * 示例 2：
	 *
	 * 输入：seq = "()(())()" 输出：[0,0,0,1,1,0,1,1] 解释：本示例答案不唯一。 按此输出 A = "()()", B =
	 * "()()", max(depth(A), depth(B)) = 1，它们的深度最小。 像 [1,1,1,0,0,1,1,1]，也是正确结果，其中 A
	 * = "()()()", B = "()", max(depth(A), depth(B)) = 1 。  
	 *
	 * 提示：
	 *
	 * 1 < seq.size <= 10000  
	 *
	 * 有效括号字符串：
	 *
	 * 仅由 "(" 和 ")" 构成的字符串，对于每个左括号，都能找到与之对应的右括号，反之亦然。 下述几种情况同样属于有效括号字符串：
	 *
	 * 1. 空字符串 2. 连接，可以记作 AB（A 与 B 连接），其中 A 和 B 都是有效括号字符串 3.
	 * 嵌套，可以记作 (A)，其中 A 是有效括号字符串 嵌套深度：
	 *
	 * 类似地，我们可以定义任意有效括号字符串 s 的 嵌套深度 depth(S)：
	 *
	 * 1. s 为空时，depth("") = 0 2. s 为 A 与 B 连接时，depth(A + B) =
	 * max(depth(A),depth(B))，其中 A 和 B 都是有效括号字符串 3. s 为嵌套情况，depth("(" + A + ")") = 1
	 * + depth(A)，其中 A 是有效括号字符串
	 *
	 * 例如：""，"()()"，和 "()(()())" 都是有效括号字符串，嵌套深度分别为 0，1，2，而 ")(" 和 "(()" 都不是有效括号字符串。
	 *
	 * 来源：力扣（LeetCode）
	 * 链接：https://leetcode-cn.com/problems/maximum-nesting-depth-of-two-valid-
	 * parentheses-strings 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */
	/*
	 * 解题思路
	 * 1. 由于题目已经告知入参为有效括号字符串 考察最大栈深问题 每个(对应一个深度，将其对等放入A,B中
	 * 2. 由于入参均为( 和 ) 故不需判断其他字符
	 */
	static final char TestCase = '(';

	public int[] maxDepthAfterSplit(String seq) {
		int size = seq.length();
		int[] ret = new int[size];
		for (int i = 0; i < size; i++) {
			char c = seq.charAt(i);
			ret[i] = c == TestCase ? i % 2 : (i + 1) % 2;
		}
		return ret;
	}

	/*
    	 * 给定一个字符串，逐个翻转字符串中的每个单词。 示例 1：
    	 *
    	 * 输入: "the sky is blue" 输出: "blue is sky the" 示例 2：
    	 *
    	 * 输入: "  hello world!  " 输出: "world! hello" 解释:
    	 * 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。 示例 3：
    	 *
    	 * 输入: "a good   example" 输出: "example good a" 解释:
    	 * 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。  
    	 *
    	 * 说明：
    	 *
    	 * 无空格字符构成一个单词。 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
    	 * 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。  
    	 *
    	 * 进阶：
    	 *
    	 * 请选用 C 语言的用户尝试使用 O(1) 额外空间复杂度的原地解法。
    	 *
    	 * 来源：力扣（LeetCode） 链接：https://leetcode-cn.com/problems/reverse-words-in-a-string
    	 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
    	 */
    	static final char testCase = ' ';

    	public String reverseWords(String s) {
        		int n = s.length();
        		LinkedList<String> strs = new LinkedList<String>();
        		StringBuilder sb = new StringBuilder();
        		for (int i = 0; i < n; i++) {
        			char target = s.charAt(i);
        			if (target == testCase) {
        				if (sb.length() > 0) {
        					strs.add(sb.toString());
        					sb.setLength(0);
        				}
        			} else {
        				sb.append(target);
        			}
        		}
        		if (sb.length() > 0) {
        			strs.add(sb.toString());
        			sb.setLength(0);
        		}
        		while (strs.size() > 0) {
        			sb.append(strs.removeLast());
        			sb.append(testCase);
        		}

        		return sb.toString().trim();
        }


	/*
	 * 	给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
	 *
	 * 	示例 1:
	 *
	 * 	输入: "abcabcbb" 输出: 3 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。 示例 2:
	 *
	 * 	输入: "bbbbb" 输出: 1 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。 示例 3:
	 *
	 * 	输入: "pwwkew" 输出: 3 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。   请注意，你的答案必须是 子串
	 *	的长度，"pwke" 是一个子序列，不是子串。
	 *
	 * 	来源：力扣（LeetCode）
	 * 	链接：https://leetcode-cn.com/problems/longest-substring-without-repeating-
	 * 	characters 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */

	// 划窗算法 计算最长字符串 缺点: 空间占用固定且较高 需要根据输入的编码表来对应编码空间 时间复杂度O(n)
	public int lengthOfLongestSubstring(String s) {
		int n = s.length();
		if (n < 2) {
			return n;
		}
		// 常用字符编码一般为128个字符
		int[] last = new int[128];
		for (int i = 0; i < last.length; i++) {
			last[i] = -1;
		}

		int size = 0, start = 0;

		for (int i = 0; i < n; i++) {
			int test = s.charAt(i);
			// 计算此位之前出现的位置与当前记录的划窗起始位置的关系 由于是位置故 + 1
			// 如果出现的字符之前均没有出现过则start始终为上一次更新的值否则start更新至当前位置
			start = Math.max(start, last[test] + 1);
			// 计算当前窗口大小 当前位置 - start位置 与之前的size做对比 取最大的窗口大小
			size = Math.max(size, i - start + 1);
			// 记录此位最后出现的位置
			last[test] = i;
		}

		return size;
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
