#!/bin/sh

if [ -t 1  ]; then
  echo "husky - commit-msg hook started"

  exec < /dev/tty

  red='\033[1;31m'
  green='\033[0;32m'
  yellow='\033[1;33m'
  no_color='\033[0m'

  echo "\n${yellow}detects if the developer forget to remove all the debug code before commit...${no_color}\n"

  confirm () {  
    printf "${yellow}"
    read -rp "Continue with commit? (y/n) " yn
    printf "${no_color}"
    if test "$yn" == "y" || test "$yn" == "Y"
    then
      printf "\n" # continue with commit
    elif test "$yn" == "n" || test "$yn" == "N"
    then
      printf "\n${red}Aborting commit${no_color}\n"
      exit 1
    else
      printf "${red}Invalid input${no_color}\n"
      confirm
    fi
  }

  check_branch () {
    if test "$(git branch --show-current)" == "master"
    then
      printf "You are on ${red}$(git branch --show-current)${no_color}.\n"
      confirm
    fi
  }

  no_console () {
    consoleRegexp='^[^-].*console.log'
    filenameRegexp='^[^-].*console.log(\|^+++'

    if test "$(git diff --cached | grep -c "$consoleRegexp")" != 0
    then
      git diff --cached | grep -ne "$filenameRegexp" | grep -B1 "$consoleRegexp"
      printf "\nSome files include ${red}console.log${no_color}.\n"
      confirm
    fi
  }

  ### Run through checks and stop if there is a problem
  check_branch
  no_console

  printf "${green}Proceeding with commit...${no_color}\n"
else 
  echo "husky - commit-msg hook skipped"

  exit 0
fi