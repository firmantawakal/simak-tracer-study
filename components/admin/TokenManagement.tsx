'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Search, RefreshCw, Send, Eye, Trash2, Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SurveyToken, Survey, Alumni } from '@prisma/client';

interface TokenWithDetails extends SurveyToken {
  survey: Survey;
  alumni: Alumni;
}

interface TokenManagementProps {
  initialTokens: TokenWithDetails[];
  totalTokens: number;
  surveys: Survey[];
}

export function TokenManagement({
  initialTokens,
  totalTokens,
  surveys
}: TokenManagementProps) {
  const [tokens, setTokens] = useState<TokenWithDetails[]>(initialTokens);
  const [search, setSearch] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSurveyForGenerate, setSelectedSurveyForGenerate] = useState<Survey | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [batchAction, setBatchAction] = useState('');

  const itemsPerPage = 20;
  const totalPages = Math.ceil(totalTokens / itemsPerPage);

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = search === '' ||
      token.survey.title.toLowerCase().includes(search.toLowerCase()) ||
      token.alumni.name.toLowerCase().includes(search.toLowerCase()) ||
      token.alumni.email.toLowerCase().includes(search.toLowerCase());

    const matchesSurvey = selectedSurvey === '' || token.surveyId === selectedSurvey;

    const matchesStatus = selectedStatus === '' ||
      (selectedStatus === 'used' && token.isUsed) ||
      (selectedStatus === 'unused' && !token.isUsed) ||
      (selectedStatus === 'expired' && new Date(token.expiresAt) < new Date());

    return matchesSearch && matchesSurvey && matchesStatus;
  });

  const paginatedTokens = filteredTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (token: TokenWithDetails) => {
    const isExpired = new Date(token.expiresAt) < new Date();

    if (token.isUsed) {
      return (
        <span className="flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Used
        </span>
      );
    } else if (isExpired) {
      return (
        <span className="flex items-center px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </span>
      );
    } else {
      return (
        <span className="flex items-center px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const handleGenerateTokens = async () => {
    if (!selectedSurveyForGenerate) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/surveys/${selectedSurveyForGenerate.id}/generate-tokens`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to generate tokens');

      const { newTokens } = await response.json();
      setTokens([...tokens, ...newTokens]);
      setAlert({ type: 'success', message: `Successfully generated ${newTokens.length} tokens!` });
      setShowModal(false);
      setSelectedSurveyForGenerate(null);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to generate tokens' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendToken = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/admin/tokens/${tokenId}/resend`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to resend token');

      setAlert({ type: 'success', message: 'Token resent successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to resend token' });
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    if (!confirm('Are you sure you want to delete this token?')) return;

    try {
      const response = await fetch(`/api/admin/tokens/${tokenId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete token');

      setTokens(tokens.filter(t => t.id !== tokenId));
      setAlert({ type: 'success', message: 'Token deleted successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete token' });
    }
  };

  const handleBatchAction = async () => {
    if (!batchAction || !selectedSurvey) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/tokens/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: batchAction,
          surveyId: selectedSurvey,
        }),
      });

      if (!response.ok) throw new Error('Failed to perform batch action');

      const result = await response.json();
      setAlert({ type: 'success', message: `Batch action completed: ${result.message}` });

      // Refresh tokens
      const tokensResponse = await fetch('/api/admin/tokens');
      const { tokens: updatedTokens } = await tokensResponse.json();
      setTokens(updatedTokens);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to perform batch action' });
    } finally {
      setIsLoading(false);
      setBatchAction('');
    }
  };

  const getTokensStats = () => {
    const total = tokens.length;
    const used = tokens.filter(t => t.isUsed).length;
    const expired = tokens.filter(t => new Date(t.expiresAt) < new Date()).length;
    const pending = total - used - expired;

    return { total, used, expired, pending };
  };

  const stats = getTokensStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Token Management</h1>
        <Button onClick={() => setShowModal(true)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Tokens
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Tokens</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">All tokens generated</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Used Tokens</h3>
          <p className="text-3xl font-bold text-green-600">{stats.used}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total > 0 ? `${((stats.used / stats.total) * 100).toFixed(1)}% usage rate` : '0% usage rate'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Tokens</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Expired Tokens</h3>
          <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
          <p className="text-sm text-gray-500 mt-1">Past expiration date</p>
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
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tokens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedSurvey}
              onChange={(e) => setSelectedSurvey(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Surveys</option>
              {surveys.map(survey => (
                <option key={survey.id} value={survey.id}>
                  {survey.title}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="used">Used</option>
              <option value="unused">Pending</option>
              <option value="expired">Expired</option>
            </select>

            {selectedSurvey && (
              <div className="flex items-center space-x-2">
                <select
                  value={batchAction}
                  onChange={(e) => setBatchAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Batch Actions</option>
                  <option value="extend">Extend Expiry (7 days)</option>
                  <option value="resend">Resend Emails</option>
                  <option value="delete-expired">Delete Expired</option>
                </select>

                {batchAction && (
                  <Button
                    onClick={handleBatchAction}
                    disabled={isLoading}
                    size="sm"
                  >
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Execute
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500">
            Showing {paginatedTokens.length} of {filteredTokens.length} tokens
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Survey</TableHead>
              <TableHead>Alumni</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead>Used At</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-medium">{token.survey.title}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{token.alumni.name}</div>
                    <div className="text-sm text-gray-500">{token.alumni.email}</div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(token)}</TableCell>
                <TableCell>
                  <div className={new Date(token.expiresAt) < new Date() ? 'text-red-600' : 'text-gray-900'}>
                    {new Date(token.expiresAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  {token.usedAt ? new Date(token.usedAt).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{new Date(token.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!token.isUsed && new Date(token.expiresAt) >= new Date() && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendToken(token.id)}
                        title="Resend token email"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteToken(token.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete token"
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

      {/* Generate Tokens Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSurveyForGenerate(null);
        }}
        title="Generate Survey Tokens"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Survey
            </label>
            <select
              value={selectedSurveyForGenerate?.id || ''}
              onChange={(e) => {
                const survey = surveys.find(s => s.id === e.target.value);
                setSelectedSurveyForGenerate(survey || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a survey...</option>
              {surveys.map(survey => (
                <option key={survey.id} value={survey.id}>
                  {survey.title}
                </option>
              ))}
            </select>
          </div>

          {selectedSurveyForGenerate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Token Generation Details:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Survey: <strong>{selectedSurveyForGenerate.title}</strong></li>
                <li>• Tokens will be generated for all alumni</li>
                <li>• Each token expires in 7 days</li>
                <li>• Tokens will be sent via email</li>
                <li>• Existing tokens for this survey will be deactivated</li>
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateTokens}
              disabled={!selectedSurveyForGenerate || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
              Generate Tokens
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}