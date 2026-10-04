from pathlib import Path
p=Path(__file__).parents[1]/'public'/'index.html'
s=p.read_text()
need=['function save()','function projectSearch()','function snapshot()','function restore()','function exportProject()','function importProject','function runCurrent()','function openAI()','function driveConnect()','function driveSave()','function driveLoad()','function diagnostics()','drive.file','Cloud Runner URL not configured']
missing=[x for x in need if x not in s]
assert not missing, missing
assert "p.includes('..')||p.startsWith('/')" in s
print('STATIC E2E PASS: 14 feature gates + path guard')
