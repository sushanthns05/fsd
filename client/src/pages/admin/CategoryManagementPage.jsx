import React, { useState, useEffect } from 'react';
import { PlusCircle, FolderTree, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';

export const CategoryManagementPage = () => {
  const { toast } = useNotifications();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/courses/categories');
      if (res.data?.success) setCategories(res.data.categories || []);
    } catch (err) {
      toast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/categories', { name, description, icon });
      if (res.data?.success) {
        toast('Category created successfully!', 'success');
        setShowModal(false);
        setName('');
        setDescription('');
        fetchCategories();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error creating category', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Category Taxonomy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize learning disciplines and technical course catalogs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">slug: {cat.slug}</p>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>
              <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {cat.courseCount || 0} active courses
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Category">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Computing & Blockchain"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline what technical areas this discipline covers..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Category
          </button>
        </form>
      </Modal>
    </div>
  );
};
