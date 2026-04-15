"use client";

import { useState } from "react";
import { useGoalsStore } from "@/store/goalsStore";
import { GoalCard } from "./GoalCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Target, Search } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { GoalForm } from "./GoalForm";
import { Goal } from "@/types";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

export function GoalList() {
  const { goals } = useGoalsStore();
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredGoals = goals.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeGoals = filteredGoals.filter(g => g.status === "active");
  const completedGoals = filteredGoals.filter(g => g.status === "completed");

  const onEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[var(--card)]/40 backdrop-blur-sm border-[var(--border)]"
            leftIcon={<Search className="h-4 w-4 text-[var(--muted-foreground)]" />}
          />
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 rounded-xl px-4 font-semibold shadow-lg shadow-[var(--primary)]/20" onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </DialogTrigger>
          <GoalForm 
            goal={editingGoal} 
            onSuccess={() => setIsFormOpen(false)} 
          />
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="inline-flex bg-[var(--card)]/40 backdrop-blur-md border border-[var(--border)] mb-6">
          <TabsTrigger value="all">All Goals ({filteredGoals.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="all" className="mt-0">
            {filteredGoals.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onEdit={onEdit} />
                ))}
              </div>
            ) : <EmptyState />}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {activeGoals.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onEdit={onEdit} />
                ))}
              </div>
            ) : <EmptyState message="No active goals found." />}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {completedGoals.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onEdit={onEdit} />
                ))}
              </div>
            ) : <EmptyState message="No completed goals yet." />}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

function EmptyState({ message = "No goals found. Start by adding one!" }: { message?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-4 rounded-full bg-[var(--card)]/40 p-6 backdrop-blur-md border border-[var(--border)]">
        <Target className="h-12 w-12 text-[var(--muted-foreground)] opacity-20" />
      </div>
      <p className="text-sm font-medium text-[var(--muted-foreground)]">
        {message}
      </p>
    </motion.div>
  );
}
