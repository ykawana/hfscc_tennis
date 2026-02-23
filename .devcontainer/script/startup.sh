#!/bin/bash

# Prepare the environment
if [ ! -e "$HOME/.bashrc" ]; then
  cp /etc/skel/.bashrc "$HOME"
fi

# Add git-completion.bash (idempotent)
if ! grep -q 'git-completion.bash' "$HOME/.bashrc"; then
  cat <<EOF >>"$HOME/.bashrc"
source \${HOME}/.oh-my-zsh/plugins/gitfast/git-completion.bash
EOF
fi

# Download go libraries
cd /workspaces/back-end/functions && go mod tidy
