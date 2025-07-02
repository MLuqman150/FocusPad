import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Eye, Edit, Plus, Trash2, FileText } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore } from '../../store/authStore';
import { Note } from '../../types';
import toast from 'react-hot-toast';

export default function NotesEditor() {
  const { notes, addNote, updateNote, currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const workspaceNotes = notes.filter(note => note.workspaceId === currentWorkspace?.id);

  useEffect(() => {
    if (workspaceNotes.length > 0 && !selectedNote) {
      setSelectedNote(workspaceNotes[0]);
    }
  }, [workspaceNotes, selectedNote]);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setIsEditing(false);
      setIsPreview(false);
    }
  }, [selectedNote]);

  const handleSave = () => {
    if (!user || !currentWorkspace) return;

    if (selectedNote) {
      updateNote(selectedNote.id, { title, content });
      toast.success('Note updated');
    } else {
      addNote({
        title: title || 'Untitled Note',
        content,
        userId: user.id,
        workspaceId: currentWorkspace.id
      });
      toast.success('Note created');
    }
    
    setIsEditing(false);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setIsEditing(true);
    setIsPreview(false);
  };

  if (!currentWorkspace) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Please select a workspace to manage notes</p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Notes Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            <button
              onClick={handleNewNote}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {workspaceNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No notes yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {workspaceNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedNote?.id === note.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <h3 className="font-medium text-gray-900 truncate">{note.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {note.content.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {note.updatedAt.toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none placeholder-gray-400"
              disabled={!isEditing && selectedNote}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedNote && (
              <>
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                    isPreview
                      ? 'bg-gray-100 text-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {isPreview ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                    isEditing
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </>
            )}
            
            {(isEditing || !selectedNote) && (
              <button
                onClick={handleSave}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {!selectedNote && !isEditing ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>Select a note to view or create a new one</p>
              </div>
            </div>
          ) : isPreview && !isEditing ? (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto prose prose-gray">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note... You can use Markdown formatting!"
              className="w-full h-full p-6 border-none resize-none focus:outline-none font-mono text-sm leading-6"
              disabled={selectedNote && !isEditing}
            />
          )}
        </div>
      </div>
    </div>
  );
}