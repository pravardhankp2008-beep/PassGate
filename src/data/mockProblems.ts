import type { Problem } from '../types';

export const mockProblems: Problem[] = [
  {
    id: 'prob-1',
    title: 'Hyperdrive Warp Matrix',
    slug: 'hyperdrive-warp-matrix',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    points: 350,
    timeLimitMs: 1200,
    memoryLimitMb: 256,
    acceptanceRate: 64.2,
    description: `A starship navigating the Orion Sector needs to calculate the minimum warp-fuel required to traverse an $N \\times M$ cosmic energy grid from coordinate $(0, 0)$ to $(N-1, M-1)$.

At each node $(i, j)$, entering costs \`grid[i][j]\` energy cells. You may only warp **Right** $(i, j+1)$, **Down** $(i+1, j)$, or execute a **Diagonal Boost** $(i+1, j+1)$ if the difference in energy between adjacent cells is strictly prime.

Return the minimum total energy units needed to reach the destination matrix coordinate.`,
    examples: [
      {
        input: 'grid = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]',
        output: '7',
        explanation: 'Optimal trajectory is (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) with total fuel: 1 + 3 + 1 + 1 + 1 = 7 units.'
      },
      {
        input: 'grid = [[1, 2, 3], [4, 8, 2], [1, 5, 3]]',
        output: '11',
        explanation: 'Trajectory (0,0) -> (0,1) -> (1,2) -> (2,2) with energy: 1 + 2 + 2 + 3 = 11.'
      }
    ],
    constraints: [
      '1 <= grid.length, grid[0].length <= 200',
      '0 <= grid[i][j] <= 10^4',
      'Execution timeout strictly enforced at 1200ms.'
    ],
    testCases: [
      {
        id: 'tc-1',
        input: '[[1, 3, 1], [1, 5, 1], [4, 2, 1]]',
        expectedOutput: '7',
        isSecret: false
      },
      {
        id: 'tc-2',
        input: '[[1, 2, 3], [4, 8, 2], [1, 5, 3]]',
        expectedOutput: '11',
        isSecret: false
      },
      {
        id: 'tc-3',
        input: '[[2, 5], [7, 3]]',
        expectedOutput: '10',
        isSecret: true
      },
      {
        id: 'tc-4',
        input: '[[5]]',
        expectedOutput: '5',
        isSecret: true
      }
    ],
    starterCode: {
      typescript: `function minWarpFuel(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  
  // dp[i][j] stores the min fuel to reach (i, j)
  const dp: number[][] = Array.from({ length: m }, () => Array(n).fill(Infinity));
  dp[0][0] = grid[0][0];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i > 0) dp[i][j] = Math.min(dp[i][j], dp[i - 1][j] + grid[i][j]);
      if (j > 0) dp[i][j] = Math.min(dp[i][j], dp[i][j - 1] + grid[i][j]);
    }
  }

  return dp[m - 1][n - 1];
}`,
      python: `def min_warp_fuel(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [[float('inf')] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    
    for i in range(m):
        for j in range(n):
            if i > 0:
                dp[i][j] = min(dp[i][j], dp[i-1][j] + grid[i][j])
            if j > 0:
                dp[i][j] = min(dp[i][j], dp[i][j-1] + grid[i][j])
                
    return dp[m-1][n-1]`,
      rust: `pub fn min_warp_fuel(grid: Vec<Vec<i32>>) -> i32 {
    let (m, n) = (grid.len(), grid[0].len());
    let mut dp = vec![vec![i32::MAX; n]; m];
    dp[0][0] = grid[0][0];

    for i in 0..m {
        for j in 0..n {
            if i > 0 { dp[i][j] = dp[i][j].min(dp[i - 1][j] + grid[i][j]); }
            if j > 0 { dp[i][j] = dp[i][j].min(dp[i][j - 1] + grid[i][j]); }
        }
    }
    dp[m - 1][n - 1]
}`,
      cpp: `int minWarpFuel(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 1e9));
    dp[0][0] = grid[0][0];
    
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) {
            if (i > 0) dp[i][j] = min(dp[i][j], dp[i-1][j] + grid[i][j]);
            if (j > 0) dp[i][j] = min(dp[i][j], dp[i][j-1] + grid[i][j]);
        }
    }
    return dp[m-1][n-1];
}`,
      go: `func minWarpFuel(grid [][]int) int {
    m, n := len(grid), len(grid[0])
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
    }
    dp[0][0] = grid[0][0]
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            if i == 0 && j == 0 { continue }
            minPrev := int(1e9)
            if i > 0 && dp[i-1][j] < minPrev { minPrev = dp[i-1][j] }
            if j > 0 && dp[i][j-1] < minPrev { minPrev = dp[i][j-1] }
            dp[i][j] = minPrev + grid[i][j]
        }
    }
    return dp[m-1][n-1]
}`
    },
    isSolved: false
  },
  {
    id: 'prob-2',
    title: 'Quantum Cache Synchronization',
    slug: 'quantum-cache-sync',
    difficulty: 'Hard',
    category: 'Concurrency & Trees',
    points: 500,
    timeLimitMs: 800,
    memoryLimitMb: 128,
    acceptanceRate: 38.7,
    description: `In a distributed quantum compute cluster with $K$ nodes, cache invalidation messages propagate through a tree topology with non-uniform quantum entanglement latencies.

Given an undirected tree of $n$ quantum servers labeled $0$ to $n-1$, and an array of edge latencies \`edges = [[u, v, latency], ...]\`, find the optimal cluster root node that minimizes the **maximum round-trip delay** to reach all leaf nodes simultaneously.`,
    examples: [
      {
        input: 'n = 4, edges = [[0,1,3],[1,2,1],[1,3,4]]',
        output: '1',
        explanation: 'Rooting at node 1 yields maximum distance to leaf 3 of 4 units, which is minimal among all candidate roots.'
      }
    ],
    constraints: [
      '2 <= n <= 10^5',
      'edges.length == n - 1',
      '1 <= latency <= 1000'
    ],
    testCases: [
      {
        id: 'tc-2-1',
        input: 'n = 4, edges = [[0,1,3],[1,2,1],[1,3,4]]',
        expectedOutput: '1',
        isSecret: false
      },
      {
        id: 'tc-2-2',
        input: 'n = 3, edges = [[0,1,2],[1,2,2]]',
        expectedOutput: '1',
        isSecret: false
      }
    ],
    starterCode: {
      typescript: `function findOptimalQuantumRoot(n: number, edges: number[][]): number {
  // Graph adjacency list with weights
  const adj: Map<number, [number, number][]> = new Map();
  for (let i = 0; i < n; i++) adj.set(i, []);
  
  for (const [u, v, w] of edges) {
    adj.get(u)!.push([v, w]);
    adj.get(v)!.push([u, w]);
  }

  // Tree center optimization
  return 1;
}`,
      python: `def find_optimal_quantum_root(n: int, edges: list[list[int]]) -> int:
    # Build tree and calculate tree radius
    return 1`,
      rust: `pub fn find_optimal_quantum_root(n: i32, edges: Vec<Vec<i32>>) -> i32 {
    1
}`,
      cpp: `int findOptimalQuantumRoot(int n, vector<vector<int>>& edges) {
    return 1;
}`,
      go: `func findOptimalQuantumRoot(n int, edges [][]int) int {
    return 1
}`
    },
    isSolved: false
  },
  {
    id: 'prob-3',
    title: 'Zero-Knowledge Packet Validator',
    slug: 'zk-packet-validator',
    difficulty: 'Easy',
    category: 'Bit Manipulation & Hashing',
    points: 200,
    timeLimitMs: 500,
    memoryLimitMb: 64,
    acceptanceRate: 88.4,
    description: `Validate whether incoming telemetry packet checksums adhere to the ByteRace cryptographic checksum format:
A 64-bit unsigned integer $X$ is deemed valid if and only if:
1. It contains an even number of set bits (parity check).
2. The XOR sum of its lower 32 bits and upper 32 bits is a power of two or zero.

Return \`true\` if the checksum is authentic, or \`false\` if it has been tampered with in transit.`,
    examples: [
      {
        input: 'packetChecksum = "0x8000000080000000"',
        output: 'true',
        explanation: 'Both halves have 1 set bit (total 2 set bits, even). Upper XOR lower is 0x0 (power of two/zero).'
      }
    ],
    constraints: [
      'Checksum is provided as a 64-bit hexadecimal string prefix "0x"',
      'No negative values'
    ],
    testCases: [
      {
        id: 'tc-3-1',
        input: '"0x8000000080000000"',
        expectedOutput: 'true',
        isSecret: false
      },
      {
        id: 'tc-3-2',
        input: '"0x0000000100000002"',
        expectedOutput: 'true',
        isSecret: false
      },
      {
        id: 'tc-3-3',
        input: '"0x0000000100000000"',
        expectedOutput: 'false',
        isSecret: true
      }
    ],
    starterCode: {
      typescript: `function validatePacketChecksum(hexString: string): boolean {
  const val = BigInt(hexString);
  
  // 1. Check parity of set bits
  let count = 0n;
  let temp = val;
  while (temp > 0n) {
    count += temp & 1n;
    temp >>= 1n;
  }
  if (count % 2n !== 0n) return false;

  // 2. XOR upper and lower 32 bits
  const lower = val & 0xFFFFFFFFn;
  const upper = (val >> 32n) & 0xFFFFFFFFn;
  const xor = lower ^ upper;

  return xor === 0n || (xor & (xor - 1n)) === 0n;
}`,
      python: `def validate_packet_checksum(hex_str: str) -> bool:
    val = int(hex_str, 16)
    if bin(val).count('1') % 2 != 0:
        return False
    lower = val & 0xFFFFFFFF
    upper = (val >> 32) & 0xFFFFFFFF
    xor_val = lower ^ upper
    return xor_val == 0 or (xor_val & (xor_val - 1)) == 0`,
      rust: `pub fn validate_packet_checksum(hex_str: &str) -> bool {
    let val = u64::from_str_radix(hex_str.trim_start_matches("0x"), 16).unwrap_or(0);
    if val.count_ones() % 2 != 0 { return false; }
    let lower = (val & 0xFFFFFFFF) as u32;
    let upper = (val >> 32) as u32;
    let xor = lower ^ upper;
    xor == 0 || (xor & (xor - 1)) == 0
}`,
      cpp: `bool validatePacketChecksum(string hexStr) {
    uint64_t val = stoull(hexStr, nullptr, 16);
    if (__builtin_popcountll(val) % 2 != 0) return false;
    uint32_t lower = val & 0xFFFFFFFF;
    uint32_t upper = val >> 32;
    uint32_t x = lower ^ upper;
    return x == 0 || (x & (x - 1)) == 0;
}`,
      go: `func validatePacketChecksum(hexStr string) bool {
    // Parse uint64 and verify bitwise conditions
    return true
}`
    },
    isSolved: true
  },
  {
    id: 'prob-4',
    title: 'Byzantine Consensus Quorum',
    slug: 'byzantine-consensus-quorum',
    difficulty: 'Legendary',
    category: 'Distributed Systems & Graphs',
    points: 800,
    timeLimitMs: 2000,
    memoryLimitMb: 512,
    acceptanceRate: 19.3,
    description: `During the ByteRace 2026 Grand Sprint, an adversarial peer-to-peer gossip network is experiencing Byzantine faults. Given a directed communication graph with $V$ validators and $E$ gossip channels, determine the maximum sub-clique of validators that can guarantee atomic broadcast without partition under $F$ Byzantine traitors.

A quorum of size $Q$ can tolerate up to $F$ Byzantine failures if and only if:
$$Q \\ge 3F + 1$$
and every node in $Q$ possesses at least $2F + 1$ verified disjoint communication paths to all other participants in $Q$.

Calculate the maximal resilient quorum size.`,
    examples: [
      {
        input: 'v = 7, f = 2, edges = [[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]...]',
        output: '7',
        explanation: 'All 7 nodes form a 2-fault tolerant BFT consensus mesh.'
      }
    ],
    constraints: [
      '4 <= v <= 500',
      '0 <= f <= v / 3',
      'Graph may contain asymmetric or delayed channels'
    ],
    testCases: [
      {
        id: 'tc-4-1',
        input: 'v = 7, f = 2, edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]]',
        expectedOutput: '7',
        isSecret: false
      },
      {
        id: 'tc-4-2',
        input: 'v = 10, f = 3, edges = [...]',
        expectedOutput: '10',
        isSecret: true
      }
    ],
    starterCode: {
      typescript: `function maxResilientQuorum(v: number, f: number, edges: number[][]): number {
  if (v < 3 * f + 1) return 0;
  // Maximum flow min-cut analysis for vertex disjoint paths
  return v;
}`,
      python: `def max_resilient_quorum(v: int, f: int, edges: list[list[int]]) -> int:
    if v < 3 * f + 1:
        return 0
    return v`,
      rust: `pub fn max_resilient_quorum(v: i32, f: i32, edges: Vec<Vec<i32>>) -> i32 {
    if v < 3 * f + 1 { return 0; }
    v
}`,
      cpp: `int maxResilientQuorum(int v, int f, vector<vector<int>>& edges) {
    if (v < 3 * f + 1) return 0;
    return v;
}`,
      go: `func maxResilientQuorum(v int, f int, edges [][]int) int {
    if v < 3*f + 1 { return 0 }
    return v
}`
    },
    isSolved: false
  },
  {
    id: 'prob-5',
    title: 'Subnet Anomaly Sliding Window',
    slug: 'subnet-anomaly-sliding-window',
    difficulty: 'Medium',
    category: 'Sliding Window & Deque',
    points: 300,
    timeLimitMs: 900,
    memoryLimitMb: 128,
    acceptanceRate: 54.1,
    description: `Analyze live packet throughput rate logs \`throughput\` over sliding window of duration $K$ seconds. An anomaly occurs whenever the variance within any sub-window exceeds threshold $\\tau$ or the maximum spike is more than triple the median.

Return the indices of all anomalous window start seconds.`,
    examples: [
      {
        input: 'throughput = [12, 14, 11, 48, 13, 15], k = 3, tau = 15.0',
        output: '[1, 2, 3]',
        explanation: 'Windows containing the 48 spike exhibit high variance triggering alerts.'
      }
    ],
    constraints: [
      '1 <= throughput.length <= 10^5',
      '1 <= k <= throughput.length',
      '0 <= throughput[i] <= 10^6'
    ],
    testCases: [
      {
        id: 'tc-5-1',
        input: 'throughput = [12, 14, 11, 48, 13, 15], k = 3, tau = 15.0',
        expectedOutput: '[1, 2, 3]',
        isSecret: false
      }
    ],
    starterCode: {
      typescript: `function findAnomalousWindows(throughput: number[], k: number, tau: number): number[] {
  const result: number[] = [];
  // Use monotonic queues and sliding accumulator for O(N) complexity
  return [1, 2, 3];
}`,
      python: `def find_anomalous_windows(throughput: list[int], k: int, tau: float) -> list[int]:
    return [1, 2, 3]`,
      rust: `pub fn find_anomalous_windows(throughput: Vec<i32>, k: i32, tau: f64) -> Vec<i32> {
    vec![1, 2, 3]
}`,
      cpp: `vector<int> findAnomalousWindows(vector<int>& throughput, int k, double tau) {
    return {1, 2, 3};
}`,
      go: `func findAnomalousWindows(throughput []int, k int, tau float64) []int {
    return []int{1, 2, 3}
}`
    },
    isSolved: false
  }
];
