"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HomeIcon } from "lucide-react"
import {
  collection,
  onSnapshot,
  updateDoc,
  setDoc,
  doc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase"; // Adjust path if needed


const ROOMMATES = [
  { id: "mariana", name: "Mariana", color: "bg-pink-500" },
  { id: "sofia", name: "Sofia", color: "bg-purple-500" },
  { id: "jaimee", name: "Jaimee", color: "bg-blue-500" },
  { id: "dovi", name: "Dovi", color: "bg-green-500" },
  { id: "christina", name: "Christina", color: "bg-yellow-500" },
  { id: "selah", name: "Selah", color: "bg-red-500" },
]

interface RoommateStatus {
  [key: string]: boolean
}

export default function HomePage() {
  const [roommateStatus, setRoommateStatus] = useState<RoommateStatus>({})

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "roommate-status"), (snapshot) => {
      const data: RoommateStatus = {};
      snapshot.forEach((doc) => {
        data[doc.id] = doc.data().isHome;
      });
      setRoommateStatus(data);
    });
    return () => unsub();
  }, []);


  const toggleStatus = async (roommateId: string) => {
    const current = roommateStatus[roommateId] || false;
    const ref = doc(db, "roommate-status", roommateId);
    await setDoc(ref, {
      isHome: !current,
      updatedAt: serverTimestamp(),
    });
  };


  const homeCount = Object.values(roommateStatus).filter(Boolean).length

  return (
    <div className="p-4 safe-area-top">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">4010 Spruce</h1>
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <HomeIcon className="h-5 w-5" />
          <span className="text-lg font-medium">
            {homeCount} of {ROOMMATES.length} home
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {ROOMMATES.map((roommate) => {
          const isHome = roommateStatus[roommate.id] || false
          return (
            <Card key={roommate.id} className="overflow-hidden">
              <CardContent className="p-0">
                <Button
                  onClick={() => toggleStatus(roommate.id)}
                  className={`w-full h-16 rounded-none border-0 text-white font-medium text-lg transition-all ${
                    isHome ? `${roommate.color} shadow-lg` : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  variant="ghost"
                >
                  <div className="flex items-center justify-between w-full px-4">
                    <span>{roommate.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{isHome ? "Home" : "Away"}</span>
                      <div className={`w-3 h-3 rounded-full ${isHome ? "bg-white" : "bg-gray-300"}`} />
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">Tap a name to toggle home status</div>
    </div>
  )
}
