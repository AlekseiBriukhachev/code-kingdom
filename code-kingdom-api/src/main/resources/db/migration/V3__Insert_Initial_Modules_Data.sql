-- Insert Java Basics Module
INSERT INTO modules (module_id, name, description, xp_required, building) VALUES ('basics', 'Java Basics', 'Learn variables, data types, and basic syntax', 0, 'Startup Garage');

-- Insert challenges for Java Basics
INSERT INTO challenges (challenge_id, module_id, title, description, hint, starter, xp_reward, coin_reward, validation_rules) VALUES ('basics-1', (SELECT id FROM modules WHERE module_id = 'basics'), 'Your First Variable', 'Create a String variable named companyName with value CodeKingdom', 'Use: String variableName = value;', '// Create your variable here', 50, 10, '{"checks": ["String", "companyName", "CodeKingdom"]}');

INSERT INTO challenges (challenge_id, module_id, title, description, hint, starter, xp_reward, coin_reward, validation_rules) VALUES ('basics-2', (SELECT id FROM modules WHERE module_id = 'basics'), 'Mathematical Foundation', 'Create two int variables (a=10, b=20) and calculate their sum in a variable named result', 'Declare int variables and use the + operator', '// Create your variables here', 75, 15, '{"checks": ["int a", "int b", "result", "+"]}');

INSERT INTO challenges (challenge_id, module_id, title, description, hint, starter, xp_reward, coin_reward, validation_rules) VALUES ('basics-3', (SELECT id FROM modules WHERE module_id = 'basics'), 'Method Creation', 'Create a method called greet that returns Hello Developer', 'Use: public String methodName() { return value; }', '// Create your method here', 100, 25, '{"checks": ["String greet", "return", "Hello, Developer!"]}');

-- Insert Collections Framework Module
INSERT INTO modules (module_id, name, description, xp_required, building) VALUES ('collections', 'Collections Framework', 'Master Lists, Sets, Maps, and data structures', 200, 'Data Warehouse');

-- Insert challenges for Collections Framework
INSERT INTO challenges (challenge_id, module_id, title, description, hint, starter, xp_reward, coin_reward, validation_rules) VALUES ('collections-1', (SELECT id FROM modules WHERE module_id = 'collections'), 'Building Inventory', 'Create an ArrayList of Strings to store building names. Add Garage and Warehouse', 'Use: ArrayList<String> list = new ArrayList<>();', 'import java.util.ArrayList;', 150, 30, '{"checks": ["ArrayList", "String", "add", "Garage", "Warehouse"]}');

INSERT INTO challenges (challenge_id, module_id, title, description, hint, starter, xp_reward, coin_reward, validation_rules) VALUES ('collections-2', (SELECT id FROM modules WHERE module_id = 'collections'), 'Resource Manager', 'Create a HashMap to map resource names to quantities. Add wood->100 and stone->50', 'Use: HashMap<String, Integer> map = new HashMap<>();', 'import java.util.HashMap;', 200, 40, '{"checks": ["HashMap", "put", "wood", "stone"]}');

-- Insert Multithreading Module
INSERT INTO modules (module_id, name, description, xp_required, building) VALUES ('multithreading', 'Multithreading', 'Learn concurrent programming and parallel execution', 500, 'Parallel Factory');

-- Insert challenges for Multithreading
INSERT INTO challenges (challenge_id, module_id, title, description, hint, starter, xp_reward, coin_reward, validation_rules) VALUES ('thread-1', (SELECT id FROM modules WHERE module_id = 'multithreading'), 'Worker Thread', 'Create a class that implements Runnable with a run method that prints Worker active', 'Use: class Worker implements Runnable { public void run() { ... } }', '// Create your Worker class', 250, 50, '{"checks": ["implements Runnable", "public void run", "Worker active"]}');

-- Insert Spring Framework Module
INSERT INTO modules (module_id, name, description, xp_required, building) VALUES ('spring', 'Spring Framework', 'Build enterprise applications with Spring', 1000, 'Enterprise Tower');

-- Insert challenges for Spring Framework
INSERT INTO challenges (challenge_id, module_id, title, description, hint, starter, xp_reward, coin_reward, validation_rules) VALUES ('spring-1', (SELECT id FROM modules WHERE module_id = 'spring'), 'Component Creation', 'Create a class annotated with @Component named UserService', 'Use @Component annotation above your class', '// Create your Spring component', 300, 75, '{"checks": ["@Component", "class UserService"]}');

