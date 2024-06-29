import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { categories } from "../data/categories";
import { Activity } from "../types";
import { ActivityActions, ActivityState } from "../reducers/activity-reducer";

type FormProps = {
    dispatch: React.Dispatch<ActivityActions>,
    state: ActivityState
}

const initialState : Activity = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
}

const Form = ({ dispatch, state }: FormProps) => {
    const [activity, setActivity] = useState<Activity>(initialState);

    useEffect(() => {
        if(state.activeId) {
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id == state.activeId)[0];
            setActivity(selectedActivity);
        }
    }, [state.activeId]);

    const isValidActivity = () => {
        const { name, calories } = activity;
        return name.trim() !== '' && calories > 0;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Almacenar actividad
        dispatch({ type: 'save-activity', payload: { newActivity: activity } });

        // Reiniciar formulario, generando un id nuevo para la próxima actividad
        setActivity({
            ...initialState,
            id: uuidv4()
        });
    }

    return (
        <form
            onSubmit={handleSubmit} noValidate
            className="space-y-5 bg-white shadow p-10 rounded-lg"
        >
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="category"
                    className="font-bold ml-1"
                >Categoría: </label>

                <select
                    id="category"
                    className="w-full border border-slate-300 px-3 py-2 rounded-lg bg-white"
                    value={activity.category}
                    onChange={e => setActivity({
                        ...activity,
                        category: +e.target.value
                    })}
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="name"
                    className="font-bold ml-1"
                >Actividad: </label>

                <input
                    id="name"
                    type="text"
                    className="w-full border border-slate-300 px-3 py-2 rounded-lg bg-white"
                    placeholder="Ej. Comida, Pesas, Bicicleta..."
                    value={activity.name}
                    onChange={e => setActivity({
                        ...activity,
                        name: e.target.value
                    })}
                />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="calories"
                    className="font-bold ml-1"
                >Calorías: </label>

                <input
                    id="calories"
                    type="number"
                    className="w-full border border-slate-300 px-3 py-2 rounded-lg bg-white"
                    placeholder="Ej. 300"
                    value={activity.calories}
                    onChange={e => setActivity({
                        ...activity,
                        calories: +e.target.value
                    })}
                />
            </div>

            <input
                type="submit"
                className="w-full mt-4 bg-gray-800 hover:bg-gray-900 hover:cursor-pointer transition-colors text-white text-center font-bold uppercase px-3 py-2 disabled:opacity-10 disabled:cursor-not-allowed"
                value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
                disabled={!isValidActivity()}
            />
        </form>
    )
}

export default Form;