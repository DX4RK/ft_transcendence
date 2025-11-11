#!/bin/bash

CYAN='\033[1;36m'
GREEN='\033[1;32m'
NC='\033[0m'

clear

echo -e "${CYAN}"
cat <<'EOF'
  __ _      _                                          _
 / _| |_   | |_ _ __ __ _ _ __  ___  ___ ___ _ __   __| | ___ _ __   ___ ___
| |_| __|  | __| '__/ _` | '_ \/ __|/ __/ _ \ '_ \ / _` |/ _ \ '_ \ / __/ _ \
|  _| |_   | |_| | | (_| | | | \__ \ (_|  __/ | | | (_| |  __/ | | | (_|  __/
|_|  \__|___\__|_|  \__,_|_| |_|___/\___\___|_| |_|\__,_|\___|_| |_|\___\___|
       |_____|
EOF
echo -e "${NC}"

cols=$(tput cols)
msg="Project is ready! 🚀\n"
padding=$(( (cols - ${#msg}) / 2 ))
echo -e "${GREEN}$(printf "%*s%s" $padding "" "$msg")${NC}"

services=("Frontend" "Backend" "Vault")
urls=("https://localhost:8443" "http://localhost:3000" "http://localhost:8200")

col1_header="Service"
col2_header="URL"

col1_width=${#col1_header}
col2_width=${#col2_header}

for s in "${services[@]}"; do
    (( ${#s} > col1_width )) && col1_width=${#s}
done
for u in "${urls[@]}"; do
    (( ${#u} > col2_width )) && col2_width=${#u}
done

col1_width=$((col1_width + 2))
col2_width=$((col2_width + 2))

table_width=$((col1_width + col2_width + 3))

table_padding=$(( (cols - table_width) / 2 ))

print_line() {
    printf "%*s+" $table_padding ""
    printf '%*s' "$col1_width" '' | tr ' ' '-'
	printf "-"
	printf "-"
    printf "+"
    printf '%*s' "$col2_width" '' | tr ' ' '-'
    printf "+\n"
}

print_line
printf "%*s|${CYAN} %-${col1_width}s${NC}|${CYAN} %-${col2_width}s${NC}|\n" $table_padding "" "$col1_header" "$col2_header"
print_line

for i in "${!services[@]}"; do
    printf "%*s| ${CYAN}%-${col1_width}s${NC}| ${GREEN}%-${col2_width}s${NC}|\n" $table_padding "" "${services[i]}" "${urls[i]}"
done

print_line
