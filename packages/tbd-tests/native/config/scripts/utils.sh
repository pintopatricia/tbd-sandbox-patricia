#!/bin/sh
## Usage: ./scripts/utils

RED=`tput setaf 1`
GREEN=`tput setaf 2`
YELLOW=`tput setaf 3`
BLUE=`tput setaf 4`
MAGENTA=`tput setaf 5`
CYAN=`tput setaf 6`
NC=`tput sgr0`

## Usage variables: echo "${RED}red text ${GREEN}green text${NC}"

# displays a list with selectable options and key input control
# Usage: select_option "one two three"
function select_option {

    # little helpers for terminal print control and key input
    ESC=$( printf "\033")
    cursor_blink_on()  { printf "$ESC[?25h"; }
    cursor_blink_off() { printf "$ESC[?25l"; }
    cursor_to()        { printf "$ESC[$1;${2:-1}H"; }
    print_option()     { printf "${NC}   $1 "; }
    print_selected()   { printf "${GREEN}\xE2\x9e\x9c [$1]"; }
    get_cursor_row()   { IFS=';' read -sdR -p $'\E[6n' ROW COL; echo ${ROW#*[}; }
    key_input()        { read -s -n3 key 2>/dev/null >&2
                         if [[ $key = $ESC[A ]]; then echo up;    fi
                         if [[ $key = $ESC[B ]]; then echo down;  fi
                         if [[ $key = ""     ]]; then echo enter; fi; }

    # initially print empty new lines (scroll down if at bottom of screen)
    for opt; do printf "\n"; done

    # determine current screen position for overwriting the options
    local lastrow=`get_cursor_row`
    local startrow=$(($lastrow - $#))

    # ensure cursor and input echoing back on upon a ctrl+c during read -s
    trap "cursor_blink_on; stty echo; printf '\n'; exit" 2
    cursor_blink_off

    local selected=0
    while true; do
        # print options by overwriting the last lines
        local idx=0
        for opt; do
            cursor_to $(($startrow + $idx))
            if [ $idx -eq $selected ]; then
                print_selected "$opt"
            else
                print_option "$opt"
            fi
            ((idx++))
        done

        # user key control
        case `key_input` in
            enter) break;;
            up)    ((selected--));
                   if [ $selected -lt 0 ]; then selected=$(($# - 1)); fi;;
            down)  ((selected++));
                   if [ $selected -ge $# ]; then selected=0; fi;;
        esac
    done

    # cursor position back to normal
    cursor_to $lastrow
    printf "\n"
    cursor_blink_on

    return $selected
}

# lists available runtime simulators and OS versions.
# Usage: request_simulators
function request_simulators_ios {
    platform="iOS"

    selectInstruction="\n${CYAN}Note: You can swap versions anytime by running from ./tests: ./scripts/settings/select.sh\n"

    echo "\nRequesting list of iOS simulators...\n"

    # list and filter iPhone devices only
    simulators=$(instruments -s devices | grep 'iPhone' | tr ' ' '-')

    options=($simulators)

    echo "Select one of the iPhone versions available for local testing and enter to confirm."

    # display selection list
    select_option "${options[@]}"
    choice=$?

    # build device name
    deviceName=${options[$choice]}

    # split full string and extract device name
    IFS="(" read -ra deviceName <<< "$deviceName"

    # remove last character from device name '-'
    deviceName="${deviceName[0]%?}"

    # build platform version
    platformVersion=$(echo ${options[$choice]} | sed 's/.*-(\(.*\))-.*/\1/')

    # update app.config.json file with deviceName and platformVersion
    yarn workspace $NATIVE_WORKSPACE run deviceProperties $platform $deviceName $platformVersion
}

function request_emulators_android {
    platform="android"
    selectInstruction="\n${CYAN}Note: You can swap versions anytime by running from ./tests: ./scripts/settings/select.sh\n"

    echo "\nRequesting list of Android emulators...\n"

    # list and filter Android devices only
    simulators=$(${ANDROID_HOME}/emulator/emulator -list-avds)

    if [[ -z $simulators ]]; then
        echo "${RED}error${NC} No Android emulators available.\n"
        echo "To create an emulator follow the instructions on this page: ${CYAN}https://developer.android.com/studio/run/managing-avds#createavd"
        echo "Keep in mind we currently support Android APIs between 30 to 33.\n "
        exit 1;
    else
        options=($simulators)
    fi

    echo "Select one of the Android versions available for local testing and enter to confirm. $selectInstruction"

    # display selection list
    select_option "${options[@]}"
    choice=$?

    # build device name
    deviceName=${options[$choice]}

    # update app.config.json file with deviceName and platformVersion
    yarn workspace $NATIVE_WORKSPACE run deviceProperties $platform $deviceName
}

# lists environments
# Usage: request_environments
function request_environments {

    echo "\nRequesting list of environments \n"

    # list available environments
    environments="mockserver localhost qa drk nxt prf prd"
    envOptions=($environments)

    echo "Select one environment available for local testing and enter to confirm."

    # display selection list
    select_option "${envOptions[@]}"
    choice=$?

    # build device name
    environment=${envOptions[$choice]}

    # Replace last } with key/value of TBDN_ENVIROMENT
    yarn workspace $NATIVE_WORKSPACE run environment $environment
}

# extracts a value from a given object key/value pair
function getValueForKey {
    key=$1
    file=$2
    keyValuePair=$(grep "$1" $2)
    valueForKeyExp='s/.*"'$1'": "?([^,"]*)"?.*\}/\1/'
    value="$(echo {$keyValuePair} | sed -E "$valueForKeyExp")"
    if [ "$value" = "{}" ]; then
        echo ""
    else
        echo "$value"
    fi
}
