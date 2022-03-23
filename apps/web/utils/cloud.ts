export function returnLanguageFromRuntime(runtime = '') {
  const selectedRuntime = runtime.replace(/[0-9]/g, '')
  return selectedRuntime.includes('js') ? 'javascript' : selectedRuntime
}
