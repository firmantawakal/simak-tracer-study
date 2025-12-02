'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Settings, User, Lock, Bell, Database, Shield, Mail, Key } from 'lucide-react';
import { Admin } from '@/prisma/client';

interface AdminSettingsProps {
  currentAdmin: Admin;
}

export function AdminSettings({ currentAdmin }: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: currentAdmin.name,
    username: currentAdmin.username,
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Email settings state (from environment variables)
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    emailFrom: '',
  });

  // Token settings state
  const [tokenSettings, setTokenSettings] = useState({
    tokenExpiryDays: '7',
    jwtSecret: '',
    jwtExpiry: '7d',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'email', label: 'Email Settings', icon: Mail },
    { id: 'tokens', label: 'Token Settings', icon: Key },
    { id: 'system', label: 'System', icon: Database },
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setAlert({ type: 'error', message: 'Password must be at least 8 characters long' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }

      setAlert({ type: 'success', message: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailSettings),
      });

      if (!response.ok) throw new Error('Failed to update email settings');

      setAlert({ type: 'success', message: 'Email settings updated successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update email settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings/tokens', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenSettings),
      });

      if (!response.ok) throw new Error('Failed to update token settings');

      setAlert({ type: 'success', message: 'Token settings updated successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update token settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const testEmailSettings = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: currentAdmin.username, // Using username as email for testing
        }),
      });

      if (!response.ok) throw new Error('Failed to send test email');

      setAlert({ type: 'success', message: 'Test email sent successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to send test email' });
    } finally {
      setIsLoading(false);
    }
  };

  const backupDatabase = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings/backup', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to create backup');

      const { backupUrl } = await response.json();

      // Create a download link
      const a = document.createElement('a');
      a.href = backupUrl;
      a.download = `database-backup-${new Date().toISOString().split('T')[0]}.sql`;
      a.click();

      setAlert({ type: 'success', message: 'Database backup created and downloaded!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to create database backup' });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async () => {
    if (!confirm('Are you sure you want to clear the application cache? This may temporarily slow down the application.')) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings/clear-cache', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to clear cache');

      setAlert({ type: 'success', message: 'Application cache cleared successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to clear cache' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-8 w-8 text-gray-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>

              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Update Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>

              <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Email Configuration</h2>

              <form onSubmit={handleEmailSettingsUpdate} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Host
                    </label>
                    <Input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Port
                    </label>
                    <Input
                      type="text"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                      placeholder="587"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Username
                  </label>
                  <Input
                    type="email"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                    placeholder="your-email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Password
                  </label>
                  <Input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    placeholder="App password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Email
                  </label>
                  <Input
                    type="email"
                    value={emailSettings.emailFrom}
                    onChange={(e) => setEmailSettings({ ...emailSettings, emailFrom: e.target.value })}
                    placeholder="noreply@example.com"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Save Email Settings
                  </Button>

                  <Button type="button" variant="outline" onClick={testEmailSettings}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Test Email
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Token Configuration</h2>

              <form onSubmit={handleTokenSettingsUpdate} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token Expiry (Days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={tokenSettings.tokenExpiryDays}
                    onChange={(e) => setTokenSettings({ ...tokenSettings, tokenExpiryDays: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of days before survey tokens expire</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JWT Secret
                  </label>
                  <Input
                    type="password"
                    value={tokenSettings.jwtSecret}
                    onChange={(e) => setTokenSettings({ ...tokenSettings, jwtSecret: e.target.value })}
                    placeholder="Minimum 32 characters"
                    minLength={32}
                  />
                  <p className="text-xs text-gray-500 mt-1">Secret key for JWT authentication (minimum 32 characters)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JWT Expiry
                  </label>
                  <Input
                    type="text"
                    value={tokenSettings.jwtExpiry}
                    onChange={(e) => setTokenSettings({ ...tokenSettings, jwtExpiry: e.target.value })}
                    placeholder="7d"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">JWT token expiry duration (e.g., 7d, 24h, 30m)</p>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Save Token Settings
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">System Administration</h2>

              <div className="space-y-6 max-w-2xl">
                {/* Database Backup */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Database Backup</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create a backup of the entire database. This will download all data including alumni, surveys, responses, and tokens.
                  </p>
                  <Button onClick={backupDatabase} disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    <Database className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                </div>

                {/* Clear Cache */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Clear Cache</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Clear the application cache. This may temporarily slow down the application as cache is rebuilt.
                  </p>
                  <Button onClick={clearCache} variant="outline" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : null}
                    Clear Cache
                  </Button>
                </div>

                {/* System Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Application</span>
                      <span className="text-sm font-medium">Tracer Study System</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Version</span>
                      <span className="text-sm font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Environment</span>
                      <span className="text-sm font-medium capitalize">{process.env.NODE_ENV || 'development'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="text-sm font-medium">MySQL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}