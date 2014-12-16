import sublime, sublime_plugin
import os, subprocess, re
try:
  import commands
except ImportError:
  pass

PLUGIN_FOLDER = os.path.dirname(os.path.realpath(__file__))
SETTINGS_FILE = "NodeRequire.sublime-settings"

class PathCompletions(sublime_plugin.EventListener):
  def on_query_completions(self, view, prefix, locations):
    pt = locations[0]
    lineRegion = view.line(locations[0])
    lineReg = re.match(".*require\([\'\"](.*)[\'\"]\).*", view.substr(lineRegion))
    if not lineReg:
      return []
    inputRegion = sublime.Region(lineReg.start(1) + lineRegion.begin(), lineReg.end(1) + lineRegion.begin())
    if not inputRegion.contains(pt):
      return ([], sublime.INHIBIT_WORD_COMPLETIONS | sublime.INHIBIT_EXPLICIT_COMPLETIONS)
    file_path = view.file_name()
    relative_path = lineReg.group(1)
    completion = NodeUtils.run_script(file_path, relative_path)
    return (completion, sublime.INHIBIT_WORD_COMPLETIONS | sublime.INHIBIT_EXPLICIT_COMPLETIONS)

class NodeUtils:
  @staticmethod
  def run_script(file_path, relative_path):
    node_path = NodeUtils.get_node_path()
    script_path = PLUGIN_FOLDER + "/scripts/run.js"
    cmd = [node_path, script_path, file_path, relative_path]
    output = NodeUtils.get_output(cmd)
    return eval(output)

  @staticmethod
  def get_node_path():
    platform = sublime.platform()
    node_path = sublime.load_settings(SETTINGS_FILE).get("node_path").get(platform)
    return node_path

  @staticmethod
  def get_output(cmd):
    if int(sublime.version()) < 3000:
      if sublime.platform() != "windows":
        # Handle Linux and OS X in Python 2.
        run = '"' + '" "'.join(cmd) + '"'
        return commands.getoutput(run)
      else:
        # Handle Windows in Python 2.
        # Prevent console window from showing.
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        return subprocess.Popen(cmd, \
          stdout=subprocess.PIPE, \
          startupinfo=startupinfo).communicate()[0]
    else:
      # Handle all OS in Python 3.
      run = '"' + '" "'.join(cmd) + '"'
      return subprocess.check_output(run, stderr=subprocess.STDOUT, shell=True, env=os.environ)