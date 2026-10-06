export type CodeLanguage =
  | 'JavaScript'
  | 'TypeScript'
  | 'Python'
  | 'Java'
  | 'C++'
  | 'SQL'
  | 'Go'
  | 'Rust'
  | 'HTML/CSS';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CodeSnippet {
  readonly id: string;
  readonly code: string;
  readonly language: CodeLanguage;
  readonly title: string;
  readonly description: string;
  readonly difficulty: Difficulty;
}

export const CODE_LANGUAGES: CodeLanguage[] = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'SQL',
  'Go',
  'Rust',
  'HTML/CSS',
];

export const CODE_SNIPPETS: readonly CodeSnippet[] = [
  // ── JavaScript ────────────────────────────────────────────────────────
  {
    id: 'js-01',
    code: 'const greet = (name) => `Hello, ${name}!`;',
    language: 'JavaScript',
    title: 'Arrow Function',
    description: 'Template literal with arrow function',
    difficulty: 'easy',
  },
  {
    id: 'js-02',
    code: 'const [count, setCount] = useState(0);',
    language: 'JavaScript',
    title: 'React useState',
    description: 'React state hook destructuring',
    difficulty: 'easy',
  },
  {
    id: 'js-03',
    code: 'const result = arr.filter((x) => x > 10).map((x) => x * 2).reduce((a, b) => a + b, 0);',
    language: 'JavaScript',
    title: 'Array Chain',
    description: 'Chained filter, map, and reduce',
    difficulty: 'medium',
  },
  {
    id: 'js-04',
    code: 'async function fetchData(url) { const res = await fetch(url); return res.json(); }',
    language: 'JavaScript',
    title: 'Async Fetch',
    description: 'Async/await with fetch API',
    difficulty: 'medium',
  },
  {
    id: 'js-05',
    code: 'const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };',
    language: 'JavaScript',
    title: 'Debounce',
    description: 'Debounce utility function',
    difficulty: 'hard',
  },
  {
    id: 'js-06',
    code: 'export default function App() { return <div className="container">{children}</div>; }',
    language: 'JavaScript',
    title: 'React Component',
    description: 'Simple React functional component with JSX',
    difficulty: 'medium',
  },
  {
    id: 'js-07',
    code: 'const { data, error, loading } = useSWR("/api/user", fetcher);',
    language: 'JavaScript',
    title: 'useSWR Hook',
    description: 'Data fetching with SWR destructuring',
    difficulty: 'easy',
  },
  {
    id: 'js-08',
    code: 'const memoized = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
    language: 'JavaScript',
    title: 'useMemo',
    description: 'React memoization hook',
    difficulty: 'medium',
  },
  {
    id: 'js-09',
    code: 'try { const parsed = JSON.parse(input); validate(parsed); } catch (err) { console.error("Parse failed:", err.message); }',
    language: 'JavaScript',
    title: 'Try-Catch JSON',
    description: 'Error handling with JSON parsing',
    difficulty: 'hard',
  },
  {
    id: 'js-10',
    code: 'const unique = [...new Set(array)];',
    language: 'JavaScript',
    title: 'Unique Array',
    description: 'Remove duplicates with Set spread',
    difficulty: 'easy',
  },
  {
    id: 'js-11',
    code: 'document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });',
    language: 'JavaScript',
    title: 'Keyboard Event Listener',
    description: 'Escape key event binding and modal closure',
    difficulty: 'easy',
  },
  {
    id: 'js-12',
    code: 'const clone = structuredClone(state); Object.freeze(clone);',
    language: 'JavaScript',
    title: 'Deep Clone & Freeze',
    description: 'Structured clone with object freezing for immutability',
    difficulty: 'medium',
  },

  // ── TypeScript ────────────────────────────────────────────────────────
  {
    id: 'ts-01',
    code: 'interface User { id: string; name: string; email?: string; readonly createdAt: Date; }',
    language: 'TypeScript',
    title: 'User Interface',
    description: 'TypeScript interface with optional and readonly properties',
    difficulty: 'easy',
  },
  {
    id: 'ts-02',
    code: 'function getFirst<T>(items: readonly T[]): T | undefined { return items[0]; }',
    language: 'TypeScript',
    title: 'Generic Function',
    description: 'Generic typed array accessor function',
    difficulty: 'easy',
  },
  {
    id: 'ts-03',
    code: 'function isString(val: unknown): val is string { return typeof val === "string"; }',
    language: 'TypeScript',
    title: 'Type Guard Predicate',
    description: 'User-defined type guard with type predicate',
    difficulty: 'medium',
  },
  {
    id: 'ts-04',
    code: 'type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; message: string };',
    language: 'TypeScript',
    title: 'Discriminated Union',
    description: 'Generic discriminated union type for API responses',
    difficulty: 'medium',
  },
  {
    id: 'ts-05',
    code: 'type UpdateUserPayload = Partial<Omit<User, "id" | "createdAt">> & { version: number };',
    language: 'TypeScript',
    title: 'Utility Types',
    description: 'Composed Partial and Omit utility types with intersection',
    difficulty: 'hard',
  },
  {
    id: 'ts-06',
    code: 'async function apiRequest<T>(endpoint: string): Promise<T> { const r = await fetch(endpoint); return r.json() as Promise<T>; }',
    language: 'TypeScript',
    title: 'Generic API Client',
    description: 'Async generic HTTP fetch client with Promise return',
    difficulty: 'hard',
  },
  {
    id: 'ts-07',
    code: 'type RolePermissions = Record<"admin" | "editor" | "viewer", readonly string[]>;',
    language: 'TypeScript',
    title: 'Record & Union Map',
    description: 'Record utility mapped across union literal keys',
    difficulty: 'medium',
  },
  {
    id: 'ts-08',
    code: 'const coordinates: readonly [lat: number, lng: number] = [37.7749, -122.4194];',
    language: 'TypeScript',
    title: 'Labeled Readonly Tuple',
    description: 'Immutable tuple with named coordinate elements',
    difficulty: 'easy',
  },
  {
    id: 'ts-09',
    code: 'type Nullable<T> = { [K in keyof T]: T[K] | null };',
    language: 'TypeScript',
    title: 'Mapped Type',
    description: 'Mapped type turning all object keys nullable',
    difficulty: 'hard',
  },
  {
    id: 'ts-10',
    code: 'const themeConfig = { mode: "dark", accent: "#6366f1" } as const;',
    language: 'TypeScript',
    title: 'Const Assertion',
    description: 'Deeply immutable literal type assertion',
    difficulty: 'easy',
  },

  // ── Python ────────────────────────────────────────────────────────────
  {
    id: 'py-01',
    code: 'result = [x ** 2 for x in range(10) if x % 2 == 0]',
    language: 'Python',
    title: 'List Comprehension',
    description: 'Filtered list comprehension with squares',
    difficulty: 'easy',
  },
  {
    id: 'py-02',
    code: 'def fibonacci(n): a, b = 0, 1; return [a := b, b := a + b for _ in range(n)]',
    language: 'Python',
    title: 'Fibonacci Walrus',
    description: 'Fibonacci sequence generator with walrus operator',
    difficulty: 'medium',
  },
  {
    id: 'py-03',
    code: 'with open("data.json", "r", encoding="utf-8") as f: data = json.load(f)',
    language: 'Python',
    title: 'Context Manager File Read',
    description: 'Safe JSON file reading with context manager',
    difficulty: 'easy',
  },
  {
    id: 'py-04',
    code: 'class User: def __init__(self, name: str, age: int): self.name = name; self.age = age',
    language: 'Python',
    title: 'Class Definition',
    description: 'Python class with typed constructor attributes',
    difficulty: 'medium',
  },
  {
    id: 'py-05',
    code: 'from functools import lru_cache; @lru_cache(maxsize=128) def expensive(n): return sum(i ** 2 for i in range(n))',
    language: 'Python',
    title: 'LRU Cache Decorator',
    description: 'Memoized function with functools lru_cache',
    difficulty: 'hard',
  },
  {
    id: 'py-06',
    code: 'sorted_data = sorted(items, key=lambda x: x["score"], reverse=True)',
    language: 'Python',
    title: 'Lambda Sort',
    description: 'Sorting dictionary list with lambda key',
    difficulty: 'medium',
  },
  {
    id: 'py-07',
    code: 'async def fetch_all(urls): tasks = [asyncio.create_task(fetch(u)) for u in urls]; return await asyncio.gather(*tasks)',
    language: 'Python',
    title: 'Asyncio Gather',
    description: 'Concurrent async task execution with asyncio gather',
    difficulty: 'hard',
  },
  {
    id: 'py-08',
    code: 'from dataclasses import dataclass; @dataclass(frozen=True) class Point: x: float; y: float',
    language: 'Python',
    title: 'Frozen Dataclass',
    description: 'Immutable 2D point dataclass definition',
    difficulty: 'easy',
  },
  {
    id: 'py-09',
    code: 'word_counts = {w: words.count(w) for w in set(words) if len(w) > 3}',
    language: 'Python',
    title: 'Dict Comprehension',
    description: 'Frequency counter with dictionary comprehension',
    difficulty: 'medium',
  },
  {
    id: 'py-10',
    code: 'import re; match = re.match(r"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$", email)',
    language: 'Python',
    title: 'Regex Match',
    description: 'Regular expression email validation match',
    difficulty: 'medium',
  },

  // ── Java ──────────────────────────────────────────────────────────────
  {
    id: 'java-01',
    code: 'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }',
    language: 'Java',
    title: 'Main Entry Point',
    description: 'Standard Java main method with println',
    difficulty: 'easy',
  },
  {
    id: 'java-02',
    code: 'List<String> active = users.stream().filter(User::isActive).map(User::getName).toList();',
    language: 'Java',
    title: 'Stream Filter & Map',
    description: 'Java stream pipeline with method references',
    difficulty: 'medium',
  },
  {
    id: 'java-03',
    code: 'public record UserProfile(UUID id, String username, String email) {}',
    language: 'Java',
    title: 'Java Record',
    description: 'Compact immutable Java record class declaration',
    difficulty: 'easy',
  },
  {
    id: 'java-04',
    code: 'try (BufferedReader br = new BufferedReader(new FileReader(path))) { return br.readLine(); }',
    language: 'Java',
    title: 'Try-With-Resources',
    description: 'Automatic resource management with BufferedReader',
    difficulty: 'medium',
  },
  {
    id: 'java-05',
    code: 'String val = Optional.ofNullable(token).map(String::trim).orElseThrow(() -> new IllegalArgumentException("Empty"));',
    language: 'Java',
    title: 'Optional Chaining',
    description: 'Safe null handling with Optional and exception fallback',
    difficulty: 'hard',
  },
  {
    id: 'java-06',
    code: '@GetMapping("/users/{id}") public ResponseEntity<User> getUser(@PathVariable Long id) { return ResponseEntity.ok(service.findById(id)); }',
    language: 'Java',
    title: 'Spring RestController',
    description: 'Spring Boot REST endpoint mapping with ResponseEntity',
    difficulty: 'hard',
  },
  {
    id: 'java-07',
    code: 'Map<String, Integer> map = new HashMap<>(); map.computeIfPresent("score", (k, v) -> v + 10);',
    language: 'Java',
    title: 'HashMap Compute',
    description: 'Atomic map computation with lambda remapping',
    difficulty: 'medium',
  },
  {
    id: 'java-08',
    code: 'CompletableFuture.supplyAsync(() -> fetchRemoteData()).thenAccept(this::processResult);',
    language: 'Java',
    title: 'CompletableFuture',
    description: 'Asynchronous task execution and callback chaining',
    difficulty: 'hard',
  },
  {
    id: 'java-09',
    code: 'int maxVal = Arrays.stream(numbers).max().orElse(0);',
    language: 'Java',
    title: 'Arrays Stream Max',
    description: 'Primitive array stream aggregation with default fallback',
    difficulty: 'easy',
  },
  {
    id: 'java-10',
    code: 'public interface Repository<T, ID> { Optional<T> findById(ID id); T save(T entity); }',
    language: 'Java',
    title: 'Generic Repository Interface',
    description: 'Generic CRUD repository contract definition',
    difficulty: 'medium',
  },

  // ── C++ ───────────────────────────────────────────────────────────────
  {
    id: 'cpp-01',
    code: '#include <iostream>\nint main() { std::cout << "Hello, C++!" << std::endl; return 0; }',
    language: 'C++',
    title: 'Hello World',
    description: 'Standard iostream print and program exit',
    difficulty: 'easy',
  },
  {
    id: 'cpp-02',
    code: 'std::sort(vec.begin(), vec.end(), [](const auto& a, const auto& b) { return a.score > b.score; });',
    language: 'C++',
    title: 'std::sort with Lambda',
    description: 'Algorithm sorting with generic lambda comparator',
    difficulty: 'medium',
  },
  {
    id: 'cpp-03',
    code: 'auto ptr = std::make_unique<Widget>(42, "Engine"); ptr->execute();',
    language: 'C++',
    title: 'Unique Smart Pointer',
    description: 'Modern RAII resource management with std::make_unique',
    difficulty: 'easy',
  },
  {
    id: 'cpp-04',
    code: 'for (const auto& [key, val] : scoreMap) { std::cout << key << ": " << val << "\\n"; }',
    language: 'C++',
    title: 'Structured Binding',
    description: 'C++17 range-based loop with structured bindings',
    difficulty: 'medium',
  },
  {
    id: 'cpp-05',
    code: 'template <typename T> constexpr T clamp(T val, T low, T high) { return (val < low) ? low : (high < val) ? high : val; }',
    language: 'C++',
    title: 'Template Constexpr Clamp',
    description: 'Compile-time generic mathematical clamping function',
    difficulty: 'hard',
  },
  {
    id: 'cpp-06',
    code: 'class Timer { private: double start_; public: explicit Timer(double t) : start_(t) {} double elapsed() const { return start_; } };',
    language: 'C++',
    title: 'Class with Const Method',
    description: 'Encapsulated class with explicit constructor and const getter',
    difficulty: 'hard',
  },
  {
    id: 'cpp-07',
    code: 'void logMessage(std::string_view msg) { std::cout << "[LOG] " << msg << "\\n"; }',
    language: 'C++',
    title: 'std::string_view Param',
    description: 'Zero-copy string parameter passing with std::string_view',
    difficulty: 'easy',
  },
  {
    id: 'cpp-08',
    code: 'if (auto it = cache.find(key); it != cache.end()) { return it->second; }',
    language: 'C++',
    title: 'If Statement Initializer',
    description: 'C++17 scoped iterator search within conditional statement',
    difficulty: 'medium',
  },
  {
    id: 'cpp-09',
    code: 'std::lock_guard<std::mutex> lock(mtx); sharedResource.push_back(data);',
    language: 'C++',
    title: 'Thread Lock Guard',
    description: 'Thread-safe critical section lock guard scoping',
    difficulty: 'hard',
  },
  {
    id: 'cpp-10',
    code: 'constexpr std::array<int, 5> primes = {2, 3, 5, 7, 11}; static_assert(primes.size() == 5);',
    language: 'C++',
    title: 'Constexpr Array & Static Assert',
    description: 'Compile-time array evaluation with static_assert',
    difficulty: 'medium',
  },

  // ── SQL ───────────────────────────────────────────────────────────────
  {
    id: 'sql-01',
    code: 'SELECT name, email FROM users WHERE active = true ORDER BY created_at DESC;',
    language: 'SQL',
    title: 'Basic SELECT Filter',
    description: 'Filtered and sorted user query',
    difficulty: 'easy',
  },
  {
    id: 'sql-02',
    code: 'SELECT u.name, COUNT(o.id) AS order_count FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name HAVING COUNT(o.id) > 5;',
    language: 'SQL',
    title: 'JOIN + GROUP BY + HAVING',
    description: 'Table join aggregation with group count threshold',
    difficulty: 'hard',
  },
  {
    id: 'sql-03',
    code: 'INSERT INTO products (name, price, category) VALUES ("Widget", 29.99, "Tools");',
    language: 'SQL',
    title: 'INSERT Product',
    description: 'Insert a new record row into products table',
    difficulty: 'easy',
  },
  {
    id: 'sql-04',
    code: 'UPDATE users SET last_login = NOW(), login_count = login_count + 1 WHERE id = 42;',
    language: 'SQL',
    title: 'UPDATE Timestamp & Increment',
    description: 'Update row attributes with atomic count increment',
    difficulty: 'medium',
  },
  {
    id: 'sql-05',
    code: 'SELECT department, AVG(salary) AS avg_salary FROM employees WHERE hire_date >= "2023-01-01" GROUP BY department ORDER BY avg_salary DESC;',
    language: 'SQL',
    title: 'Aggregation with AVG',
    description: 'Average salary calculation by department with date filter',
    difficulty: 'medium',
  },
  {
    id: 'sql-06',
    code: 'WITH RankedSales AS (SELECT rep_id, amount, DENSE_RANK() OVER (ORDER BY amount DESC) as rank FROM sales) SELECT * FROM RankedSales WHERE rank <= 3;',
    language: 'SQL',
    title: 'Common Table Expression (CTE)',
    description: 'WITH clause CTE ranking top sales representatives',
    difficulty: 'hard',
  },
  {
    id: 'sql-07',
    code: 'SELECT title, price, CASE WHEN price > 100 THEN "Premium" WHEN price > 50 THEN "Standard" ELSE "Budget" END AS tier FROM items;',
    language: 'SQL',
    title: 'CASE Conditional Statement',
    description: 'Derived category column using CASE WHEN branching',
    difficulty: 'medium',
  },
  {
    id: 'sql-08',
    code: 'SELECT * FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE total_price > 500);',
    language: 'SQL',
    title: 'Subquery IN Filter',
    description: 'Subquery filtering customers with high-value orders',
    difficulty: 'medium',
  },
  {
    id: 'sql-09',
    code: 'CREATE TABLE audit_log (id BIGSERIAL PRIMARY KEY, user_id UUID NOT NULL, action VARCHAR(64) NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());',
    language: 'SQL',
    title: 'CREATE TABLE Schema',
    description: 'Relational table declaration with primary key and defaults',
    difficulty: 'easy',
  },
  {
    id: 'sql-10',
    code: 'SELECT emp_name, dept, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rank FROM employees;',
    language: 'SQL',
    title: 'Window Function Partition',
    description: 'ROW_NUMBER window function partitioned by department',
    difficulty: 'hard',
  },

  // ── Go ────────────────────────────────────────────────────────────────
  {
    id: 'go-01',
    code: 'func main() { fmt.Println("Hello, World!") }',
    language: 'Go',
    title: 'Hello Go Main',
    description: 'Basic Go main entry function with fmt.Println',
    difficulty: 'easy',
  },
  {
    id: 'go-02',
    code: 'func add(a, b int) int { return a + b }',
    language: 'Go',
    title: 'Add Function',
    description: 'Typed Go function with explicit return parameter',
    difficulty: 'easy',
  },
  {
    id: 'go-03',
    code: 'ch := make(chan string); go func() { ch <- "hello" }(); msg := <-ch; fmt.Println(msg)',
    language: 'Go',
    title: 'Goroutine Channel Communication',
    description: 'Anonymous goroutine channel dispatch and receive',
    difficulty: 'hard',
  },
  {
    id: 'go-04',
    code: 'file, err := os.Open("config.json"); if err != nil { return fmt.Errorf("failed to open config: %w", err) }; defer file.Close()',
    language: 'Go',
    title: 'Idiomatic Error Handling',
    description: 'File opening with error wrapping and defer cleanup',
    difficulty: 'medium',
  },
  {
    id: 'go-05',
    code: 'type Server struct { Port int }; func (s *Server) Start() error { return http.ListenAndServe(fmt.Sprintf(":%d", s.Port), nil) }',
    language: 'Go',
    title: 'Struct Pointer Receiver Method',
    description: 'Custom struct definition with pointer receiver method',
    difficulty: 'medium',
  },
  {
    id: 'go-06',
    code: 'nums := make([]int, 0, 10); for i := 0; i < 5; i++ { nums = append(nums, i*2) }',
    language: 'Go',
    title: 'Slice Allocation & Append',
    description: 'Dynamic slice pre-allocation with capacity and append loop',
    difficulty: 'easy',
  },
  {
    id: 'go-07',
    code: 'var wg sync.WaitGroup; for _, url := range urls { wg.Add(1); go func(u string) { defer wg.Done(); fetch(u) }(url) }; wg.Wait()',
    language: 'Go',
    title: 'Sync WaitGroup Concurrency',
    description: 'Concurrent worker pool synchronization with WaitGroup',
    difficulty: 'hard',
  },
  {
    id: 'go-08',
    code: 'http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK); w.Write([]byte("OK")) })',
    language: 'Go',
    title: 'HTTP Health Endpoint',
    description: 'Standard library HTTP handler endpoint implementation',
    difficulty: 'medium',
  },
  {
    id: 'go-09',
    code: 'var config Config; if err := json.Unmarshal(data, &config); err != nil { log.Fatalf("parse error: %v", err) }',
    language: 'Go',
    title: 'JSON Unmarshal Parser',
    description: 'Parsing raw byte slice into typed struct reference',
    difficulty: 'medium',
  },
  {
    id: 'go-10',
    code: 'mu.Lock(); defer mu.Unlock(); counts[key]++',
    language: 'Go',
    title: 'Mutex Mutex Lock & Defer',
    description: 'Thread-safe counter increment with deferred unlock',
    difficulty: 'easy',
  },

  // ── Rust ──────────────────────────────────────────────────────────────
  {
    id: 'rs-01',
    code: 'fn main() { let x: i32 = 42; println!("The answer is {}", x); }',
    language: 'Rust',
    title: 'Hello Rust Main',
    description: 'Basic variable binding and formatted print macro',
    difficulty: 'easy',
  },
  {
    id: 'rs-02',
    code: 'fn sum(nums: &[i32]) -> i32 { nums.iter().fold(0, |acc, &x| acc + x) }',
    language: 'Rust',
    title: 'Iterator Fold Accumulator',
    description: 'Slice iteration with accumulator closure fold',
    difficulty: 'medium',
  },
  {
    id: 'rs-03',
    code: 'let result: Result<i32, String> = Ok(42); match result { Ok(v) => println!("{}", v), Err(e) => eprintln!("{}", e) }',
    language: 'Rust',
    title: 'Result Pattern Match',
    description: 'Exhaustive match expression on standard Result type',
    difficulty: 'hard',
  },
  {
    id: 'rs-04',
    code: 'struct Rectangle { width: u32, height: u32 } impl Rectangle { fn area(&self) -> u32 { self.width * self.height } }',
    language: 'Rust',
    title: 'Struct with Impl Block',
    description: 'Struct definition and method implementation with borrowed self',
    difficulty: 'medium',
  },
  {
    id: 'rs-05',
    code: 'let val: Option<String> = Some(String::from("typlix")); let len = val.as_ref().map(|s| s.len()).unwrap_or(0);',
    language: 'Rust',
    title: 'Option Map & Unwrap',
    description: 'Transforming Option reference with map and unwrap fallback',
    difficulty: 'medium',
  },
  {
    id: 'rs-06',
    code: 'pub trait Summary { fn summarize(&self) -> String; } impl Summary for Article { fn summarize(&self) -> String { self.title.clone() } }',
    language: 'Rust',
    title: 'Trait Declaration & Impl',
    description: 'Rust trait contract definition and struct implementation',
    difficulty: 'hard',
  },
  {
    id: 'rs-07',
    code: 'let squares: Vec<i32> = (0..10).filter(|&x| x % 2 == 0).map(|x| x * x).collect();',
    language: 'Rust',
    title: 'Vector Filter & Collect',
    description: 'Functional range pipeline collecting into a Vector',
    difficulty: 'easy',
  },
  {
    id: 'rs-08',
    code: 'let counter = Arc::new(Mutex::new(0)); let mut num = counter.lock().unwrap(); *num += 1;',
    language: 'Rust',
    title: 'Arc Mutex Concurrency',
    description: 'Atomic reference counted mutex locking across threads',
    difficulty: 'hard',
  },
  {
    id: 'rs-09',
    code: 'enum WebEvent { PageLoad, KeyPress(char), Paste(String), Click { x: i64, y: i64 } }',
    language: 'Rust',
    title: 'Rich Enum Variants',
    description: 'Algebraic data type enum with tuple and struct variants',
    difficulty: 'medium',
  },
  {
    id: 'rs-10',
    code: 'fn read_file() -> Result<String, std::io::Error> { let mut f = std::fs::File::open("log.txt")?; Ok(String::new()) }',
    language: 'Rust',
    title: 'Question Mark Error Propagation',
    description: 'Idiomatic error propagation using the question mark operator',
    difficulty: 'easy',
  },

  // ── HTML / CSS ────────────────────────────────────────────────────────
  {
    id: 'html-01',
    code: '<div class="container"><h1>Hello World</h1><p>Welcome to my page.</p></div>',
    language: 'HTML/CSS',
    title: 'Basic HTML Container',
    description: 'Simple container with heading and paragraph',
    difficulty: 'easy',
  },
  {
    id: 'html-02',
    code: '<nav class="flex items-center justify-between"><a href="/">Home</a><a href="/about">About</a></nav>',
    language: 'HTML/CSS',
    title: 'Flex Navbar',
    description: 'Flex navigation bar with accessible links',
    difficulty: 'medium',
  },
  {
    id: 'html-03',
    code: 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; align-items: center;',
    language: 'HTML/CSS',
    title: 'CSS Grid Layout',
    description: 'Three-column responsive grid layout with gap and alignment',
    difficulty: 'medium',
  },
  {
    id: 'html-04',
    code: '<button type="submit" class="btn btn-primary" disabled={!isValid} onClick={handleSubmit}>Submit</button>',
    language: 'HTML/CSS',
    title: 'Interactive Button',
    description: 'Button element with disabled state and event binding',
    difficulty: 'medium',
  },
  {
    id: 'html-05',
    code: '@media (max-width: 768px) { .sidebar { display: none; } .content { width: 100%; padding: 1rem; } }',
    language: 'HTML/CSS',
    title: 'Responsive Media Query',
    description: 'Mobile responsive breakpoint hiding sidebar panel',
    difficulty: 'hard',
  },
  {
    id: 'html-06',
    code: '<dialog open aria-labelledby="modal-title"><h2 id="modal-title">Settings</h2><button type="button">Close</button></dialog>',
    language: 'HTML/CSS',
    title: 'Semantic Dialog Modal',
    description: 'Native HTML5 dialog with accessibility ARIA labeling',
    difficulty: 'medium',
  },
  {
    id: 'html-07',
    code: 'display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;',
    language: 'HTML/CSS',
    title: 'Flexbox Center Viewport',
    description: 'Full viewport height centering utility declarations',
    difficulty: 'easy',
  },
  {
    id: 'html-08',
    code: ':root { --primary-hue: 220; --bg-main: hsl(var(--primary-hue) 15% 10%); --accent-color: #3b82f6; }',
    language: 'HTML/CSS',
    title: 'CSS Custom Properties',
    description: 'Root design tokens and dynamic color variable definitions',
    difficulty: 'easy',
  },
  {
    id: 'html-09',
    code: '<label for="email" class="form-label">Email</label><input id="email" type="email" required placeholder="name@example.com" />',
    language: 'HTML/CSS',
    title: 'Form Input & Label',
    description: 'Accessible labeled email input with required validation',
    difficulty: 'easy',
  },
  {
    id: 'html-10',
    code: '@keyframes pulseGlow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }',
    language: 'HTML/CSS',
    title: 'CSS Keyframe Animation',
    description: 'Smooth glowing pulse animation with transform scaling',
    difficulty: 'hard',
  },
];

/**
 * Returns a random code snippet, optionally filtered by language and/or difficulty.
 * Avoids returning the same snippet as `excludeId` when possible.
 */
export function getRandomSnippet(
  language?: CodeLanguage | null,
  difficulty?: Difficulty | null,
  excludeId?: string
): CodeSnippet {
  let pool = CODE_SNIPPETS as readonly CodeSnippet[];

  if (language) {
    pool = pool.filter((s) => s.language === language);
  }
  if (difficulty) {
    pool = pool.filter((s) => s.difficulty === difficulty);
  }

  // Fallback to full list if filters produced nothing
  if (pool.length === 0) {
    pool = CODE_SNIPPETS;
  }

  // Try to avoid repeating the last snippet
  if (excludeId && pool.length > 1) {
    pool = pool.filter((s) => s.id !== excludeId);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Returns a snippet by its id, or the first snippet as fallback.
 */
export function getSnippetById(id: string): CodeSnippet {
  return CODE_SNIPPETS.find((s) => s.id === id) || CODE_SNIPPETS[0];
}
