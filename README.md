# Webseite des AN
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Code coverage](https://asozialesnetzwerk.github.io/an-website/coverage/badge.svg)](https://asozialesnetzwerk.github.io/an-website/coverage)

## How to develop
You need:
- python3.9
- packages from requirements.txt
- packages from check-requirements.txt

### How to run
- `python -m an_website -X dev` (-X dev is for debugging)

### How to check
- `./check.sh`

### How to format
- `python -m black an_website tests`


## How to run
### Linux (tested with arch):
You need:
- python3.9
- packages from requirements.txt
- supervisord
- redis for ratelimits
- uwufetch

How
- clone this repo in the home directory of a user
- (if necessary) add the following at the end of /etc/supervisord.conf
```
  [include]
  files = /etc/supervisor.d/*.ini
```
- (if necessary) create /etc/supervisor.d/
- run restart.sh as the user of the home directory

### Windows
Why?

### FreeBSD
should work similar to linux
`/etc/supervisord.conf`   -> `/usr/local/etc/supervisord.conf`
`/etc/supervisor.d/*.ini` -> `/usr/local/etc/supervisor.d/*.ini`
`/etc/supervisor.d/`      -> `/usr/local/etc/supervisor.d/`
restart.sh: `/etc/supervisor.d/$SERVICE_FILE_NAME` -> `/usr/local/etc/supervisor.d/$SERVICE_FILE_NAME`

### MacOS
Why? (same as FreeBSD, probably)
