import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  MoreVertical
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useAppStore } from '../../store';
import { formatDate, formatCurrency } from '../../lib/utils';
import { User } from '../../types';

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  details?: string;
}

interface UserManagementProps {
  className?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ className = '' }) => {
  const { user: currentUser, addNotification } = useAppStore();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data initialization
  useEffect(() => {
    loadUsers();
    loadRoles();
    loadActivities();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Mock users data
      const mockUsers: User[] = [
        {
          id: 'user-1',
          email: 'admin@estatetracker.ng',
          name: 'System Administrator',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-12-01')
        },
        {
          id: 'user-2',
          email: 'john.developer@gmail.com',
          name: 'John Okafor',
          role: 'developer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-11-20')
        },
        {
          id: 'user-3',
          email: 'mary.client@yahoo.com',
          name: 'Mary Adebayo',
          role: 'client',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
          createdAt: new Date('2024-03-10'),
          updatedAt: new Date('2024-12-05')
        },
        {
          id: 'user-4',
          email: 'ibrahim.dev@outlook.com',
          name: 'Ibrahim Musa',
          role: 'developer',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
          createdAt: new Date('2024-04-20'),
          updatedAt: new Date('2024-11-30')
        },
        {
          id: 'user-5',
          email: 'chioma.client@gmail.com',
          name: 'Chioma Eze',
          role: 'client',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
          createdAt: new Date('2024-05-05'),
          updatedAt: new Date('2024-12-02')
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      addNotification({
        id: Date.now().toString(),
        title: 'Error',
        message: 'Failed to load users',
        type: 'error',
        read: false,
        createdAt: new Date(),
        userId: currentUser?.id || ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    const mockRoles: UserRole[] = [
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Full system access and management capabilities',
        permissions: [
          'user.create', 'user.read', 'user.update', 'user.delete',
          'estate.create', 'estate.read', 'estate.update', 'estate.delete',
          'plot.create', 'plot.read', 'plot.update', 'plot.delete',
          'document.create', 'document.read', 'document.update', 'document.delete',
          'analytics.read', 'settings.manage', 'system.admin'
        ]
      },
      {
        id: 'developer',
        name: 'Developer',
        description: 'Estate development and management capabilities',
        permissions: [
          'estate.create', 'estate.read', 'estate.update',
          'plot.create', 'plot.read', 'plot.update',
          'document.create', 'document.read', 'document.update',
          'analytics.read', 'client.manage'
        ]
      },
      {
        id: 'client',
        name: 'Client',
        description: 'View own property information and progress',
        permissions: [
          'plot.read.own', 'document.read.own',
          'progress.read.own', 'payment.read.own'
        ]
      }
    ];
    setRoles(mockRoles);
  };

  const loadActivities = async () => {
    const mockActivities: UserActivity[] = [
      {
        id: 'activity-1',
        userId: 'user-2',
        action: 'Created Estate',
        resource: 'Green Valley Estate',
        timestamp: new Date('2024-12-01T10:30:00'),
        details: 'Created new estate with 120 plots'
      },
      {
        id: 'activity-2',
        userId: 'user-3',
        action: 'Uploaded Document',
        resource: 'Certificate of Occupancy',
        timestamp: new Date('2024-12-01T14:15:00'),
        details: 'C of O for Plot A12'
      },
      {
        id: 'activity-3',
        userId: 'user-4',
        action: 'Updated Plot',
        resource: 'Plot B5',
        timestamp: new Date('2024-12-02T09:45:00'),
        details: 'Changed status to construction'
      }
    ];
    setActivities(mockActivities);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addNotification({
        id: Date.now().toString(),
        title: 'User Deleted',
        message: 'User has been successfully deleted',
        type: 'success',
        read: false,
        createdAt: new Date(),
        userId: currentUser?.id || ''
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'developer': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button
            variant="outline"
            icon={<Download className="h-4 w-4" />}
          >
            Export Users
          </Button>
          <Button
            onClick={handleCreateUser}
            icon={<Plus className="h-4 w-4" />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Developers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'developer').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'client').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="developer">Developer</option>
          <option value="client">Client</option>
        </select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Users</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(true)}
                        <span className="ml-2 text-sm text-gray-600">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          icon={<Edit className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent User Activities</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => {
              const activityUser = users.find(u => u.id === activity.userId);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <img
                    src={activityUser?.avatar}
                    alt={activityUser?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activityUser?.name}</span>
                      {' '}
                      <span className="text-gray-600">{activity.action.toLowerCase()}</span>
                      {' '}
                      <span className="font-medium">{activity.resource}</span>
                    </p>
                    {activity.details && (
                      <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Roles and Permissions Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Roles & Permissions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{role.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge
                        key={permission}
                        className="text-xs bg-gray-100 text-gray-700"
                      >
                        {permission}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge className="text-xs bg-gray-100 text-gray-700">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
