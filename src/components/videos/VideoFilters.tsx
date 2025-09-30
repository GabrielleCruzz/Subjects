import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Search, X, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type VideoFiltersProps = {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  sortOrder: string
  setSortOrder: (order: string) => void
  clearFilters: () => void
  categories: string[]
}

export const VideoFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  sortOrder,
  setSortOrder,
  clearFilters,
  categories,
}: VideoFiltersProps) => {
  const [open, setOpen] = useState(false)

  const handleCategorySelect = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    )
  }

  const hasActiveFilters =
    searchTerm !== '' || selectedCategories.length > 0 || sortOrder !== 'recent'

  return (
    <div className="mb-8 p-4 border rounded-lg bg-card shadow-subtle">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou descrição..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="truncate">
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} categoria(s)`
                  : 'Filtrar por categoria'}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Buscar categoria..." />
              <CommandList>
                <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => handleCategorySelect(category)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedCategories.includes(category)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais Recentes</SelectItem>
            <SelectItem value="popular">Mais Vistos</SelectItem>
            <SelectItem value="az">Ordem Alfabética (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-auto p-1 text-sm"
          >
            <X className="mr-1 h-4 w-4" />
            Limpar Filtros
          </Button>
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleCategorySelect(category)}
            >
              {category} <X className="ml-1.5 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
