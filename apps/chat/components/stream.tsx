// import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'
// // import 'emoji-mart/css/emoji-mart.css'
// import moment from 'moment'
// import { Component } from 'react'
// import { v4 as uuid } from 'uuid'
// import Stream from '../components/stream'
// import { createMessage, Message as Msg } from '../lib/message'
// import { setSeen } from '../lib/seen'
// import { User } from '../lib/user'
// import styles from './chat.module.scss'
// import Message from './message'

import {
    useGetStreamItemsFromContext,
    useSendMessageStreamItem,
} from '@/lib/api/stream'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { createElement, useEffect, useMemo, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CommandCenter, type Command } from './command-center'
import { SelectedCommand } from './selected-command'
import { useCreateGroup, useGetStream } from '@/lib/api/groups'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useSendMessage } from '@/lib/api/messages'
import { useCreateTopic } from '@/lib/api/topics'
import { CenteredLoader } from './loader'

const commands = [
    {
        command: '/communities create',
        description: 'This is a description',
        prompts: ['Please provide the name of your new community'],
    },
    {
        command: '/communities switch',
        description: 'Switch to a different community',
    },
    {
        command: '/topics create',
        description: 'Create a topic',
        prompts: ['Please provide the name of the topic'],
    },
    {
        command: '/hop2',
        description: 'Jump to a defined destination provided by hop2.io',
        prompts: ['Please provide the destination'],
    },
]

export function Stream({ topicId }: { topicId: string }) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const groupId = router.query.id as string
    const [showCommandCenter, setShowCommandCenter] = useState(false)
    const [selectedCommand, setSelectedCommand] = useState<Command | undefined>(
        undefined
    )
    const [currentPrompt, setCurrentPrompt] = useState(0)

    const { register, handleSubmit, watch, setValue } = useForm<{
        command: string
    }>({
        defaultValues: {
            command: '',
        },
    })

    const createGroup = useCreateGroup()

    const sendMessage = useSendMessage({
        groupId,
        topicId,
    })

    const stream = useGetStream({
        groupId,
        contextId: topicId,
    })

    const createTopic = useCreateTopic(groupId)
    const command = watch('command')

    useEffect(() => {
        if (command.charAt(0) === '/' && !selectedCommand) {
            setShowCommandCenter(true)
        } else {
            setShowCommandCenter(false)
        }
    }, [command, selectedCommand])

    const filteredCommands = commands.filter((item) =>
        item.command.includes(command)
    )

    const selectCommand = (command: Command) => {
        setSelectedCommand(command)
        setShowCommandCenter(false)
        setValue('command', '')
    }

    const resetFormSection = () => {
        setValue('command', '')
        setSelectedCommand(undefined)
    }

    const returnPlaceholder = () => {
        if (selectedCommand) {
            const command = commands.find(
                (item) => item.command === selectedCommand.command
            )

            if (command.prompts) {
                return command.prompts[currentPrompt]
            }
        }

        return "Start by sending a message or typing '/'"
    }

    const handleCommunityCreate = () => {
        createGroup.mutate(
            {
                name: command,
                paid: false,
            },
            {
                onSuccess(response) {
                    queryClient.invalidateQueries(['groups'])
                    router.push(`/groups/${response.data.group.id}`)
                },
            }
        )
    }

    const handleTopicCreate = () => {
        createTopic.mutate(
            {
                name: command,
            },
            {
                onSuccess() {
                    resetFormSection()
                },
            }
        )
    }

    const handleHop2Command = () => {
        const a = document.createElement('a') as HTMLAnchorElement
        a.setAttribute('href', `https://go.hop2.io?q=${command}`)
        a.setAttribute('target', '_blank')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setSelectedCommand(undefined)
        setValue('command', '')
    }

    const onFormSubmit = ({ command }: { command: string }) => {
        if (selectedCommand) {
            if (!selectedCommand.prompts) {
                alert('No prompts go!')
                return
            }

            if ((selectedCommand.prompts || []).length - 1 === currentPrompt) {
                if (selectedCommand.command === '/communities create') {
                    handleCommunityCreate()
                }

                if (selectedCommand.command === '/topics create') {
                    handleTopicCreate()
                }

                if (selectedCommand.command === '/hop2') {
                    handleHop2Command()
                }
                return
            } else {
                setCurrentPrompt((prev) => prev + 1)
                setValue('command', '')
            }
        } else {
            if (command.charAt(0) === '/') {
                alert('Please provide a valid command')
                setValue('command', '')
                return
            }

            sendMessage.mutate({
                message: command,
            })
        }
    }

    return (
        <div className="w-full flex flex-col p-4 bg-white">
            {stream.isLoading && <CenteredLoader />}
            <div className="mt-auto">
                {showCommandCenter && (
                    <CommandCenter
                        commands={filteredCommands}
                        onCommandClick={(item) => selectCommand(item)}
                    />
                )}
                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="bg-white flex gap-2 w-full border border-zinc-200 rounded-md"
                >
                    {selectedCommand && (
                        <SelectedCommand
                            onCancelClick={() => setSelectedCommand(undefined)}
                        >
                            {selectedCommand.command}
                        </SelectedCommand>
                    )}
                    <input
                        {...register('command', {
                            required: true,
                        })}
                        onKeyDown={(event) => {
                            console.log(event.code)
                            if (event.code === 'ArrowUp') {
                                return
                            }

                            if (event.code === 'Tab') {
                                event.preventDefault()

                                if (command === '/') {
                                    return
                                }

                                if (filteredCommands.length === 1) {
                                    selectCommand(filteredCommands[0])
                                } else {
                                    const [validCommand] = new Set([
                                        ...filteredCommands
                                            .filter((item) =>
                                                item.command.includes(command)
                                            )
                                            .map(
                                                (item) =>
                                                    item.command.split(' ')[0]
                                            ),
                                    ])

                                    if (validCommand) {
                                        setValue('command', `${validCommand} `)
                                    }
                                }
                            }

                            if (event.code === 'Escape') {
                                setSelectedCommand(undefined)
                            }
                        }}
                        placeholder={returnPlaceholder()}
                        className="flex-grow p-2 rounded-md text-sm"
                    />
                </form>
            </div>
        </div>
    )
}
