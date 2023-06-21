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
        <div className="bg-red-50">
            {commands.map((item) => (
                <button
                    key={item.command}
                    className="w-full text-left"
                    onClick={() => onCommandClick(item)}
                >
                    <p>{item.command} </p>
                    <p className="text-sm">{item.description}</p>
                </button>
            ))}
        </div>
    )
}
