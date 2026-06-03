#!/bin/bash

FILE="$(pwd)/script_logs.txt"

info(){
 message="$1"
 timestamp=$(date +"%Y-%m-%d %H:%M:%S")
 echo "[$timestamp] $message" | tee -a $FILE
}

execute(){
  command="$1"
  timestamp=$(date +"%Y-%m-%d %H:%M:%S")

  echo "[$timestamp] Executing the following command : $command , logs are available in the script_logs.txt" | tee -a $FILE
  eval "$command" >> $FILE
  exit_code=$?
  if [ $exit_code -eq 0 ]; then
    echo "[$timestamp] $command ran successfully" | tee -a $FILE
  else
    echo "[$timestamp] $command failed" | tee -a $FILE
  fi
}
