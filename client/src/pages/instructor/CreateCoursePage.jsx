import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

export const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useNotifications();

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('all-levels');
  const [language, setLanguage] = useState('English');
  const [price, setPrice] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60');
  const [trailerVideoUrl, setTrailerVideoUrl] = useState('');

  const [objectives, setObjectives] = useState(['']);
  const [requirements, setRequirements] = useState(['']);

  useEffect(() => {
    api.get('/courses/categories').then((res) => {
      if (res.data?.success && res.data.categories.length > 0) {
        setCategories(res.data.categories);
        setCategory(res.data.categories[0]._id);
      }
    });
  }, []);

  const handleAddObjective = () => setObjectives([...objectives, '']);
  const handleObjectiveChange = (index, val) => {
    const updated = [...objectives];
    updated[index] = val;
    setObjectives(updated);
  };
  const handleRemoveObjective = (index) =>
    setObjectives(objectives.filter((_, i) => i !== index));

  const handleAddRequirement = () => setRequirements([...requirements, '']);
  const handleRequirementChange = (index, val) => {
    const updated = [...requirements];
    updated[index] = val;
    setRequirements(updated);
  };
  const handleRemoveRequirement = (index) =>
    setRequirements(requirements.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      toast('Please fill in title, description, and category.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/courses', {
        title,
        subtitle,
        description,
        category,
        difficulty,
        language,
        price: isFree ? 0 : Number(price),
        isFree,
        thumbnail,
        trailerVideoUrl,
        objectives: objectives.filter((o) => o.trim() !== ''),
        requirements: requirements.filter((r) => r.trim() !== ''),
      });

      if (res.data?.success) {
        toast('Course draft created successfully!', 'success');
        navigate(`/instructor/courses/${res.data.course._id}/curriculum`);
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create course draft', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Create New Course Draft
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Define core metadata, learning objectives, and pricing. You'll add lessons and sections next.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Course Overview
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Node.js & Docker Systems"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Master scalable backend patterns and container deployment..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a thorough overview of course contents, projects, and target outcomes..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all-levels">All Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Language
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Media & Pricing */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Media & Commercial Pricing
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trailer Video URL (MP4)
              </label>
              <input
                type="url"
                value={trailerVideoUrl}
                onChange={(e) => setTrailerVideoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Offer this course for Free
              </span>
            </label>

            {!isFree && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Price (INR):</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-32 px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>
            )}
          </div>
        </div>

        {/* Objectives */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What Students Will Learn
            </h3>
            <button
              type="button"
              onClick={handleAddObjective}
              className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Objective</span>
            </button>
          </div>

          <div className="space-y-3">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => handleObjectiveChange(i, e.target.value)}
                  placeholder="e.g. Build production-grade REST APIs in Express"
                  className="flex-1 px-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(i)}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Creating Draft...' : 'Proceed to Curriculum Builder'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
