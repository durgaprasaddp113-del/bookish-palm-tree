import { useEffect, useMemo, useState } from 'react';
import ModelViewer from './components/ModelViewer';
import { supabase } from './lib/supabaseClient';

const defaultActivities = [
  'Excavation',
  'Piling',
  'Raft',
  'Columns',
  'Slabs',
  'Blockwork',
  'MEP',
  'Finishing',
].map((name, index) => ({
  id: index + 1,
  name,
  progress: 0,
  delayed: false,
  remarks: '',
  updated_at: new Date().toISOString(),
}));

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function App() {
  const [activities, setActivities] = useState(defaultActivities);
  const [statusMessage, setStatusMessage] = useState('Using local demo data. Configure Supabase env vars to persist changes.');

  useEffect(() => {
    async function loadActivities() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        setStatusMessage(`Supabase load error: ${error.message}`);
        return;
      }

      if (data?.length) {
        setActivities(data);
      }
      setStatusMessage('Connected to Supabase.');
    }

    loadActivities();
  }, []);

  const overallProgress = useMemo(() => {
    const total = activities.reduce((sum, item) => sum + Number(item.progress || 0), 0);
    return Math.round(total / activities.length);
  }, [activities]);

  const lastUpdate = useMemo(() => {
    return activities
      .map((item) => item.updated_at)
      .sort((a, b) => new Date(b) - new Date(a))[0];
  }, [activities]);

  async function updateActivity(updated) {
    setActivities((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));

    if (!supabase) return;

    const { error } = await supabase.from('activities').upsert(updated, { onConflict: 'id' });
    if (error) {
      setStatusMessage(`Supabase save error: ${error.message}`);
    } else {
      setStatusMessage(`Saved ${updated.name} at ${new Date().toLocaleTimeString()}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <header>
            <h1 className="text-2xl font-bold">4D BIM Progress Tracking MVP</h1>
            <p className="text-sm text-slate-600">Model path: /models/building.glb (name meshes to include activity names for direct color-linking).</p>
          </header>

          <ModelViewer modelUrl="/models/building.glb" activities={activities} />
          <p className="rounded bg-white p-3 text-sm shadow">{statusMessage}</p>
        </div>

        <aside className="space-y-4">
          <section className="rounded-xl bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold">Dashboard</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">Overall progress:</span> {overallProgress}%
              </li>
              <li>
                <span className="font-medium">Last update date:</span> {formatDate(lastUpdate)}
              </li>
            </ul>
          </section>

          <section className="rounded-xl bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold">Activities</h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="rounded border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm">{activity.progress}%</p>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activity.progress}
                    className="w-full"
                    onChange={(event) =>
                      updateActivity({
                        ...activity,
                        progress: Number(event.target.value),
                        updated_at: new Date().toISOString(),
                      })
                    }
                  />

                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={activity.delayed}
                      onChange={(event) =>
                        updateActivity({
                          ...activity,
                          delayed: event.target.checked,
                          updated_at: new Date().toISOString(),
                        })
                      }
                    />
                    Delayed
                  </label>

                  <textarea
                    rows="2"
                    className="mt-2 w-full rounded border p-2 text-sm"
                    value={activity.remarks || ''}
                    placeholder="Remarks"
                    onChange={(event) =>
                      updateActivity({
                        ...activity,
                        remarks: event.target.value,
                        updated_at: new Date().toISOString(),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
