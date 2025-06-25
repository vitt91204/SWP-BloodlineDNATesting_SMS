import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  placeholder: string;
}

export default function SearchBar({ searchTerm, onSearch, placeholder }: SearchBarProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}