import { spawn } from 'child_process'

function run(command: string, args: string[]) {
    return spawn(command, args, {
        stdio: 'inherit',
        shell: true
    })
}

const next = run('npm', ['run', 'dev:next'])
const monitor = run('npm', ['run', 'dev:monitor'])

function shutdown() {
    next.kill('SIGINT')
    monitor.kill('SIGINT')
    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
