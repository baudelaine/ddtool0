#!/bin/bash
curl --cookie cookies.txt --cookie-jar cookies.txt http://localhost/ddtool/Reset
curl --cookie cookies.txt --cookie-jar cookies.txt --data "table=S_SAMPLE&alias=S_SAMPLE_ALIAS&type=Final&pk=false" http://localhost/ddtool/GetQuerySubjects | jshon -S
curl --cookie cookies.txt --cookie-jar cookies.txt --data "table=S_BATCH&alias=S_BATCH_ALIAS&type=Final&pk=false" http://localhost/ddtool/GetQuerySubjects | jshon -S
curl --cookie cookies.txt --cookie-jar cookies.txt --data "table=SYSUSER&alias=SYSUSER_ALIAS&type=Ref&pk=false" http://localhost/ddtool/GetQuerySubjects | jshon -S > all.json
curl --cookie cookies.txt --cookie-jar cookies.txt http://localhost/ddtool/SendQuerySubjects

