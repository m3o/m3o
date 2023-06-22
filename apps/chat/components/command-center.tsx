export type Command = {
    command: string
    description: string
    prompts?: string[]
}

type CommandCenterProps = {
    commands: Command[]
    /* eslint-disable no-unused-vars */
    onCommandClick: (command: Command) => void
    /* eslint-enable */
}

export function CommandCenter({
    commands,
    onCommandClick,
}: CommandCenterProps) {
    return (
        <div className="bg-zinc-100 p-2">
            {commands.map((item) => (
                <button
                    key={item.command}
                    className="w-full text-left p-2 hover:bg-zinc-200 rounded-md box-border"
                    onClick={() => onCommandClick(item)}
                >
                    <p className="text-sm font-medium">{item.command} </p>
                    <p className="text-xs text-zinc-500">{item.description}</p>
                </button>
            ))}
        </div>
    )
}
