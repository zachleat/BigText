rem Usage: JsTestDriver.bat TestName
rem		 where TestName is a directory and TestName.conf in the root.

java -jar test/lib/JsTestDriver-1.2.2-custom.jar --config "test/bigtext.conf" --browser "C:\Program Files\Internet Explorer\iexplore.exe" --tests all --port 8081