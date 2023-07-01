"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import {
    storeBracketState,
    retrieveBracketState,
    updateMatchResult,
} from "../app/firebaseFunctions"
import { Bracket } from "@/utils/TournamentTypes"
import { v4 as uuidv4 } from "uuid"

export const bracketId = uuidv4()
interface Participant {
    name: string
}

interface Match {
    participant1: string
    participant2: string
    winner: string | null
}

const Bracket: React.FC = () => {
    const [numParticipants, setNumParticipants] = useState<number>(0)
    const [participantNames, setParticipantNames] = useState<Participant[]>([])
    const [matches, setMatches] = useState<Match[]>([
        { participant1: "", participant2: "", winner: "" },
    ])
    const [currentRound, setCurrentRound] = useState<number>(0)
    const [error, setError] = useState<string>("")
    const bracketId = "tournament" // Add the bracket ID here
    const [showNextRound, setShowNextRound] = useState(false)
    const [showParticipants, setShowParticipants] = useState(false)
    const handleNumParticipantsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value, 10)
        setNumParticipants(count)
        setParticipantNames(
            Array(count)
                .fill("")
                .map(() => ({ name: "" }))
        )
        setError("")
    }

    const handleParticipantNameChange = (
        e: ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const newNames = [...participantNames]
        newNames[index].name = e.target.value
        setParticipantNames(newNames)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!isPowerOfTwo(numParticipants)) {
            setError("Number of participants must be a power of 2.")
            return
        }

        const initialMatches: Match[] = []
        for (let i = 0; i < numParticipants / 2; i++) {
            const match: Match = {
                participant1: participantNames[i * 2].name,
                participant2: participantNames[i * 2 + 1].name,
                winner: null,
            }
            initialMatches.push(match)
        }

        const bracket: Bracket = {
            id: bracketId,
            matchdata: {
                id: bracketId,
                rounds: initialMatches,
            },
        }

        try {
            // Store flattened bracket in Firebase
            await storeBracketState(bracket)
            // Set the matches state to the initial matches
            setMatches(initialMatches)
            // Reset the current round
            setCurrentRound(0)
        } catch (error) {
            // Handle error while storing bracket in Firebase
            setError("Failed to store bracket in Firebase.")
        }
    }

    const handleMatchWinnerChange = async (
        e: ChangeEvent<HTMLSelectElement>,
        index: number
    ) => {
        const newMatches = [...matches]
        const winner = e.target.value === "" ? null : e.target.value
        if (index === matches.length - 1) {
            setShowNextRound(true)
        }
        // Check if the index is within the bounds of the matches array
        if (index >= 0 && index < newMatches.length) {
            newMatches[index].winner = winner
            setMatches(newMatches)

            try {
                // Update match result in Firebase
                await updateMatchResult(bracketId, currentRound, index, winner)
            } catch (error) {
                // Handle error while updating match result in Firebase
                setError("Failed to update match result in Firebase.")
            }
        }
    }

    const generateNextRound = () => {
        const nextRoundMatches: Match[] = []
        for (let i = 0; i < matches.length; i += 2) {
            const match: Match = {
                participant1: matches[i].winner as string,
                participant2: matches[i + 1].winner as string,
                winner: null,
            }
            nextRoundMatches.push(match)
        }
        setMatches(nextRoundMatches)
        setCurrentRound(currentRound + 1)
    }

    const isPowerOfTwo = (num: number) => {
        return (num & (num - 1)) === 0 && num !== 0
    }

    useEffect(() => {
        const retrieveBracket = async () => {
            const bracket = await retrieveBracketState()
            if (bracket) {
                setMatches(bracket.matchdata.rounds)
            }
        }

        retrieveBracket()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">
                Tournament Bracket Generator
            </h1>
            <form onSubmit={handleSubmit}>
                <label className="block mb-4">
                    Number of Participants:
                    <input
                        type="number"
                        min="2"
                        step="1"
                        value={numParticipants}
                        onChange={handleNumParticipantsChange}
                        className="border border-gray-300 px-2 py-1 mt-2"
                        data-testid={"number_participants"}
                    />
                </label>
                {currentRound < 1 && (
                    <div>
                        {participantNames.map((participant, index) => (
                            <div key={index} className="mb-4">
                                <label>
                                    Participant {index + 1}:
                                    <input
                                        type="text"
                                        value={participant.name}
                                        onChange={(e) =>
                                            handleParticipantNameChange(
                                                e,
                                                index
                                            )
                                        }
                                        className="border border-gray-300 px-2 py-1 mt-2"
                                        data-testid={`participant_${index}`}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                )}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2"
                >
                    Generate Bracket
                </button>
            </form>

            {matches.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mt-8">
                        Tournament Bracket - Round {currentRound + 1}
                    </h2>
                    <div className="flex flex-col items-center mt-4">
                        {matches.map((match, index) => (
                            <div key={index} className="flex items-center mb-4">
                                <div className="w-20 h-10 bg-gray-300 flex justify-center items-center">
                                    {match.participant1}
                                </div>
                                <div className="mx-2">vs</div>
                                <div className="w-20 h-10 bg-gray-300 flex justify-center items-center">
                                    {match.participant2}
                                </div>
                                <div className="mx-2">Winner:</div>
                                {match.winner === null ? (
                                    <select
                                        onChange={(e) =>
                                            handleMatchWinnerChange(e, index)
                                        }
                                        className="border border-gray-300 px-2 py-1 mt-2"
                                    >
                                        <option value="">Undecided</option>
                                        <option value={match.participant1}>
                                            {match.participant1}
                                        </option>
                                        <option value={match.participant2}>
                                            {match.participant2}
                                        </option>
                                    </select>
                                ) : (
                                    <div>{match.winner}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {showNextRound &&
                        currentRound + 1 < Math.log2(numParticipants) && (
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 mt-4"
                                onClick={generateNextRound}
                            >
                                Generate Next Round
                            </button>
                        )}
                </div>
            )}
        </div>
    )
}

export default Bracket
