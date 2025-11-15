import { create } from "zustand"

interface PageTitleState {
    title: string
    setTitle: (value: string) => void
}

export const usePageTitle = create<PageTitleState>((set) =>
{    
    
return  ({
    
    title: "Page",
    setTitle: (value) => set({ title: value }),
})}

)
