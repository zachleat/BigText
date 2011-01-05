# Usage: ./JsTestDriver.sh TestName
#		 where TestName is a directory and TestName.conf in the root.

java -jar test/lib/JsTestDriver-1.2.2-custom.jar --config "test/bigtext.conf" --browser "test/lib/launch-safari.sh" --tests all --port 8081
osascript -e 'tell application "Safari" to quit' > /dev/null 2>&1