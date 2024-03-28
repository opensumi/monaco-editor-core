SCRIPT_PATH=$(realpath "$0")
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")

wget https://github.com/opensumi/monaco-editor-core/pull/14.patch
git am --keep-cr --signoff <  14.patch
rm 14.patch
