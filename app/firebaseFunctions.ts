import { Bracket } from "@/utils/TournamentTypes"
import { db } from "../firebaseConfig" // Assuming you've already set up Firebase
import { bracketId } from "../components/bracket"

const storeBracketState = async (bracket: Bracket) => {
    const flattenedBracket = {
        rounds: bracket.matchdata.rounds.flat(),
        id: bracketId,
    }
    const data = {
        id: bracketId,
        matchdata: flattenedBracket,
    }

    await db.collection("brackets").doc("tournament").set(data)
}

const retrieveBracketState = async (): Promise<Bracket | undefined> => {
    try {
        const doc = await db.collection("brackets").doc("tournament").get()
        const bracket = doc.data() as Bracket
        return bracket
    } catch (error) {
        console.error("Error retrieving bracket state:", error)
        return undefined
    }
}

const updateMatchResult = async (
    bracketId: string,
    round: number,
    matchIndex: number,
    winner: string | null
) => {
    try {
        const bracketRef = db.collection("brackets").doc("tournament")
        const snapshot = await bracketRef.get()
        const bracket = snapshot.data() as Bracket

        // Update the winner of the specified match
        bracket.matchdata.rounds[matchIndex].winner = winner

        // Update the modified bracket in Firestore
        await bracketRef.update(bracket)
    } catch (error) {
        console.error("Failed to update match result in Firebase:", error)
        throw new Error("Failed to update match result in Firebase.")
    }
}
export { storeBracketState, retrieveBracketState, updateMatchResult }
