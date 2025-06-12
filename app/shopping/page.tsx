"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"
import { ShoppingCart } from "lucide-react" // Declared the ShoppingCart variable
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "../../lib/firebase";

interface ShoppingItem {
  id: string
  text: string
  completed: boolean
  addedBy: string
  createdAt: number
}

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    const q = query(collection(db, "shopping-items"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ShoppingItem[];
      setItems(itemsData);
      console.log('Fetched:', itemsData);
    });
    return () => unsubscribe();
  }, []);

  const addItem = async () => {
    if (newItem.trim()) {
      await addDoc(collection(db, "shopping-items"), {
        text: newItem.trim(),
        completed: false,
        addedBy: "Someone",
        createdAt: serverTimestamp(),
      });
      setNewItem("");
    }
  };


  const toggleItem = async (id: string, current: boolean) => {
    const itemRef = doc(db, "shopping-items", id);
    await updateDoc(itemRef, { completed: !current });
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "shopping-items", id));
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = async () => {
    if (editText.trim() && editingId) {
      const itemRef = doc(db, "shopping-items", editingId);
      await updateDoc(itemRef, {
        text: editText.trim(),
      });
      setEditingId(null);
      setEditText("");
    }
  };
  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const completedItems = items.filter((item) => item.completed)
  const activeItems = items.filter((item) => !item.completed)

  return (
    <div className="p-4 safe-area-top">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h1>
        <p className="text-gray-600">{activeItems.length} items to buy</p>
      </div>

      {/* Add new item */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new item..."
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              className="flex-1"
            />
            <Button onClick={addItem} size="icon" className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active items */}
      <div className="space-y-3 mb-6">
        {activeItems.map((item) => (
          <Card key={item.id} className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              {editingId === item.id ? (
                <div className="flex gap-2 items-center">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={saveEdit} size="icon" variant="ghost" className="text-green-600">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button onClick={cancelEdit} size="icon" variant="ghost" className="text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item.id, item.completed)} />
                  <span className="flex-1 text-gray-900">{item.text}</span>
                  <Button
                    onClick={() => startEdit(item.id, item.text)}
                    size="icon"
                    variant="ghost"
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteItem(item.id)}
                    size="icon"
                    variant="ghost"
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completed items */}
      {completedItems.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Completed ({completedItems.length})</h2>
          <div className="space-y-2">
            {completedItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-gray-300 opacity-60">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={item.completed} onCheckedChange={() => toggleItem(item.id, item.completed)} />
                    <span className="flex-1 text-gray-600 line-through">{item.text}</span>
                    <Button
                      onClick={() => deleteItem(item.id)}
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No items in your shopping list yet</p>
          <p className="text-sm">Add your first item above!</p>
        </div>
      )}
    </div>
  )
}
