'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus, Search, Edit, Trash2, Mail, Download, Upload } from 'lucide-react';
import { Alumni } from '@prisma/client';

interface AlumniManagementProps {
  initialAlumni: Alumni[];
  totalAlumni: number;
}

export function AlumniManagement({ initialAlumni, totalAlumni }: AlumniManagementProps) {
  const [alumni, setAlumni] = useState<Alumni[]>(initialAlumni);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    graduationYear: new Date().getFullYear(),
    major: '',
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalAlumni / itemsPerPage);

  const filteredAlumni = alumni.filter(alumni =>
    alumni.name.toLowerCase().includes(search.toLowerCase()) ||
    alumni.email.toLowerCase().includes(search.toLowerCase()) ||
    alumni.major.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingAlumni
        ? `/api/admin/alumni/${editingAlumni.id}`
        : '/api/admin/alumni';

      const method = editingAlumni ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save alumni');

      const savedAlumni = await response.json();

      if (editingAlumni) {
        setAlumni(alumni.map(a => a.id === editingAlumni.id ? savedAlumni : a));
        setAlert({ type: 'success', message: 'Alumni updated successfully!' });
      } else {
        setAlumni([...alumni, savedAlumni]);
        setAlert({ type: 'success', message: 'Alumni added successfully!' });
      }

      setShowModal(false);
      setEditingAlumni(null);
      setFormData({ name: '', email: '', graduationYear: new Date().getFullYear(), major: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save alumni' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alumni?')) return;

    try {
      const response = await fetch(`/api/admin/alumni/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete alumni');

      setAlumni(alumni.filter(a => a.id !== id));
      setAlert({ type: 'success', message: 'Alumni deleted successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete alumni' });
    }
  };

  const handleEdit = (alumni: Alumni) => {
    setEditingAlumni(alumni);
    setFormData({
      name: alumni.name,
      email: alumni.email,
      graduationYear: alumni.graduationYear,
      major: alumni.major,
    });
    setShowModal(true);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Graduation Year', 'Major', 'Created At'],
      ...alumni.map(a => [
        a.name,
        a.email,
        a.graduationYear.toString(),
        a.major,
        new Date(a.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumni.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Alumni Management</h1>
        <div className="flex space-x-3">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Alumni
          </Button>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search alumni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {paginatedAlumni.length} of {filteredAlumni.length} alumni
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Graduation Year</TableHead>
              <TableHead>Major</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAlumni.map((alumni) => (
              <TableRow key={alumni.id}>
                <TableCell className="font-medium">{alumni.name}</TableCell>
                <TableCell>{alumni.email}</TableCell>
                <TableCell>{alumni.graduationYear}</TableCell>
                <TableCell>{alumni.major}</TableCell>
                <TableCell>{new Date(alumni.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(alumni)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(alumni.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAlumni(null);
          setFormData({ name: '', email: '', graduationYear: new Date().getFullYear(), major: '' });
        }}
        title={editingAlumni ? 'Edit Alumni' : 'Add New Alumni'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year
            </label>
            <Input
              type="number"
              required
              min="1990"
              max={new Date().getFullYear() + 5}
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Major
            </label>
            <Input
              type="text"
              required
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
              {editingAlumni ? 'Update Alumni' : 'Add Alumni'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}