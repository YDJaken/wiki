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
	 * Suppose you have a random list of people standing in a queue. Each person is
	 * described by a pair of integers (h, k), where h is the height of the person
	 * and k is the number of people in front of this person who have a height
	 * greater than or equal to h. Write an algorithm to reconstruct the queue.
	 *
	 * Note: The number of people is less than 1,100.
	 *
	 *   Example
	 *
	 * Input: [[7,0], [4,4], [7,1], [5,0], [6,1], [5,2]]
	 *
	 * Output: [[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]
	 *
	 *	来源：力扣（LeetCode）
	 *	链接：https://leetcode-cn.com/problems/queue-reconstruction-by-height
	 *	著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */
	// 两次排序 先按h排升序 再按k排降序
	public int[][] reconstructQueue(int[][] people) {
		if (0 == people.length || 0 == people[0].length)
			return new int[0][0];
		Arrays.parallelSort(people, new Comparator<int[]>() {
			public int compare(int[] o1, int[] o2) {
				return o1[0] == o2[0] ? o1[1] - o2[1] : o2[0] - o1[0];
			}
		});

		List<int[]> list = new ArrayList<>();
		for (int[] i : people) {
			list.add(i[1], i);
		}
		return list.toArray(new int[list.size()][]);
	}

    /*
	 * 给定一个整数数组 nums ，小李想将 nums 切割成若干个非空子数组，使得每个子数组最左边的数和最右边的数的最大公约数大于 1
	 * 。为了减少他的工作量，请求出最少可以切成多少个子数组。
	 *
	 * 示例 1：
	 *
	 * 输入：nums = [2,3,3,2,3,3]
	 *
	 * 输出：2
	 *
	 * 解释：最优切割为 [2,3,3,2] 和 [3,3] 。第一个子数组头尾数字的最大公约数为 2 ，第二个子数组头尾数字的最大公约数为 3 。
	 *
	 * 示例 2：
	 *
	 * 输入：nums = [2,3,5,7]
	 *
	 * 输出：4
	 *
	 * 解释：只有一种可行的切割：[2], [3], [5], [7]
	 *
	 * 限制：
	 *
	 * 1 <= nums.length <= 10^5 2 <= nums[i] <= 10^6
	 *
	 * 来源：力扣（LeetCode） 链接：https://leetcode-cn.com/problems/qie-fen-shu-zu
	 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */

	 static int[] primes;

	    static {
	        int maxN = 1_000_000;
	        int limit = 1_000;
	        primes = new int[maxN + 1];
	        for (int i = 2; i <=maxN; i+=2) {
	            primes[i] = 2;
	        }


	        for (int i = 3; i <=maxN; i += 2) {
	            if (primes[i] > 0) {
	                continue;
	            }
	            primes[i] = i;
	            if (i > limit) {
	                continue;
	            }
	            for (int j = i * i; j <=maxN; j+= i) {
	                primes[j] = i;
	            }
	        }
	    }

	    public int splitArray(int[] nums) {
	        int max = 0;
	        for (int num : nums) {
	            max = Math.max(num, max);
	        }


	        int pre = 0;
	        int[] f = new int[max + 1];
	        for (int i = 0; i < f.length; i++) {
	            f[i] = f.length;
	        }

	        for (int num : nums) {
	            max = primes.length;
	            while (num > 1) {
	                int check = primes[num];
	                num /= check;
	                f[check] = Math.min(f[check], pre + 1);
	                max = Math.min(max, f[check]);
	            }
	            pre = max;
	        }
	        return pre;
	    }

    /*
	 * For strings S and T, we say "T divides S" if and only if S = T + ... + T  (T
	 * concatenated with itself 1 or more times)
	 *
	 * Return the largest string X such that X divides str1 and X divides str2.
	 *
	 * Example 1:
	 * Input: str1 = "ABCABC", str2 = "ABC" Output: "ABC"
	 * Example 2:
	 * Input: str1 = "ABABAB", str2 = "ABAB" Output: "AB"
	 * Example 3:
	 * Input: str1 = "LEET", str2 = "CODE" Output: ""  
	 *
	 * Note:
	 *
	 * 1 <= str1.length <= 1000
	 * 1 <= str2.length <= 1000
	 * str1[i] and str2[i] are English uppercase letters.
	 *
	 * 	来源：力扣（LeetCode）
	 * 	链接：https://leetcode-cn.com/problems/greatest-common-divisor-of-strings
	 * 	著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */
    // 解法1:
	 public String gcdOfStrings(String str1, String str2) {
	        int length1 = str1.length();
	        int length2 = str2.length();
	        do {
	            if (length1 < length2) {
	                if (!str2.endsWith(str1)) {
	                    return "";
	                }
	                length2 -= length1;
	                if (length2 == 0) {
	                    return str1;
	                }
	                str2 = str2.substring(0, length2);
	            } else {
	                if (!str1.endsWith(str2)) {
	                    return "";
	                }
	                length1 -= length2;
	                if (length1 == 0) {
	                    return str2;
	                }
	                str1 = str1.substring(0, length1);
	            }
	        } while (true);
	}
	// 解法2:
	public String gcdOfStrings(String str1, String str2) {
		if(!(str1 + str2).equals(str2 + str1)){
			return "";
		}

		return str1.substring(0,findGCD(str1.length(),str2.length()));
	}

	private int findGCD(int a, int b) {
		return b == 0? a : findGCD(b , a % b);
	}


	/*
	 * Given a non-empty special binary tree consisting of nodes with the
	 * non-negative value, where each node in this tree has exactly two or zero
	 * sub-node. If the node has two sub-nodes, then this node's value is the
	 * smaller value among its two sub-nodes. More formally, the property root.val =
	 * min(root.left.val, root.right.val) always holds.
	 *
	 * Given such a binary tree, you need to output the second minimum value in the
	 * set made of all the nodes' value in the whole tree.
	 *
	 * If no such second minimum value exists, output -1 instead.
	 *
	 * Example 1:
	 *
	 * Input: 2 / \ 2 5 / \ 5 7
	 *
	 * Output: 5 Explanation: The smallest value is 2, the second smallest value is
	 * 5.
	 *
	 *
	 * Example 2:
	 *
	 * Input: 2 / \ 2 2
	 *
	 * Output: -1 Explanation: The smallest value is 2, but there isn't any second
	 * smallest value.
	 */
	 class TreeNode {
     		int val;
     		TreeNode left;
     		TreeNode right;

     		TreeNode() {
     		}

     		TreeNode(int val) {
     			this.val = val;
     		}

     		TreeNode(int val, TreeNode left, TreeNode right) {
     			this.val = val;
     			this.left = left;
     			this.right = right;
     		}
     }
	// 树节点遍历
	public int findSecondMinimumValue(TreeNode root) {
		if (root == null || root.left == null) {
			return -1;
		}
		return findValue(root, root.val);
	}

	private int findValue(TreeNode node, int value) {
		if (node.val != value) {
			return node.val;
		} else {
			if(node.left == null) {
				return -1;
			}
			int left = findValue(node.left, value);
			int right = findValue(node.right, value);
			if(left == -1) {
				return right;
			}
			if(right == -1) {
				return left;
			}
			return Math.min(left, right);
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
	 * 统计字符串中的单词个数，这里的单词指的是连续的不是空格的字符。
	 *
	 * 请注意，你可以假定字符串里不包括任何不可打印的字符。
	 *
	 * 示例:
	 *
	 * 输入: "Hello, my name is John" 输出: 5 解释: 这里的单词是指连续的不是空格的字符，所以 "Hello," 算作 1
	 * 个单词。
	 *
	 * 来源：力扣（LeetCode）
	 * 链接：https://leetcode-cn.com/problems/number-of-segments-in-a-string
	 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */
	static final char testCase = ' ';
	public int countSegments(String s) {
		int size = s.length();
		int count = 0,step = 0;
		for (int i = 0; i < size; i++) {
			char target = s.charAt(i);
			if (target == testCase) {
				if (step > 0) {
					count++;
					step = 0;
				}
			} else {
				step++;
			}
		}
		if (step > 0) {
			count++;
			step = 0;
		}
		return count;
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

    /*
	 * 编写一个函数来查找字符串数组中的最长公共前缀。
	 *
	 * 如果不存在公共前缀，返回空字符串 ""。
	 *
	 * 示例 1:
	 *
	 * 输入: ["flower","flow","flight"] 输出: "fl" 示例 2:
	 *
	 * 输入: ["dog","racecar","car"] 输出: "" 解释: 输入不存在公共前缀。 说明:
	 *
	 * 所有输入只包含小写字母 a-z 。
	 *
	 * 来源：力扣（LeetCode） 链接：https://leetcode-cn.com/problems/longest-common-prefix
	 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */

	public String longestCommonPrefix(String[] strs) {
		if (strs.length < 2) {
			try {
				return strs[0];
			} catch (Exception e) {
				return "";
			}
		}
		String first = strs[0];
		String second = strs[1];
		StringBuilder sb = new StringBuilder();
		int length = Math.min(first.length(), second.length());
		for (int i = 0; i < length; i++) {
			if (first.charAt(i) == second.charAt(i)) {
				sb.append(first.charAt(i));
			} else {
				break;
			}
		}
		length = strs.length;
		for (int i = 2; i < length; i++) {
			int stSize = sb.length();
			if (stSize == 0) {
				return "";
			}
			if(stSize > strs[i].length()) {
				stSize = strs[i].length();
				sb.setLength(stSize);
			}
			for (int j = stSize - 1; j >= 0; j--) {
				if(sb.charAt(j) != strs[i].charAt(j)) {
					sb.setLength(j);
				}
			}
		}
		return sb.toString();
	}

    /*
	 * 给定一个整数数组，你需要寻找一个连续的子数组，如果对这个子数组进行升序排序，那么整个数组都会变为升序排序。
	 *
	 * 你找到的子数组应是最短的，请输出它的长度。
	 *
	 * 示例 1:
	 *
	 * 输入: [2, 6, 4, 8, 10, 9, 15] 输出: 5 解释: 你只需要对 [6, 4, 8, 10, 9]
	 * 进行升序排序，那么整个表都会变为升序排序。 说明 :
	 *
	 * 输入的数组长度范围在 [1, 10,000]。 输入的数组可能包含重复元素 ，所以升序的意思是<=。
	 *
	 * 来源：力扣（LeetCode）
	 * 链接：https://leetcode-cn.com/problems/shortest-unsorted-continuous-subarray
	 * 著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
	 */
	/*
	 * 題目要求只寻找一个连续子数组 故数组内只有一段乱序数组 双指针遍历
	 */
	public int findUnsortedSubarray(int[] nums) {
		int size = nums.length, last = size - 1;
		int start = 0, end = -1, max = nums[0], min = nums[last];
		for (int i = 0; i < size; i++) {
			int target = nums[i];
			if (target < max) {
				end = i;
			} else {
				max = target;
			}
			target = nums[last - i];
			if (target > min) {
				start = last - i;
			} else {
				min = target;
			}
		}

		return end - start + 1;
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
