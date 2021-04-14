import {Switch, Route, Redirect} from "react-router-dom";
import {MainPage} from "./pages/MainPage";
import {NewHabitsPage} from "./pages/NewHabitsPage";
import {BadHabitsPage} from "./pages/BadHabitsPage";
import {TasksPage} from "./pages/TasksPage";
import {NewHabitDetailPage} from "./pages/NewHabitDetailPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <MainPage />
                </Route>
                <Route path="/BadHabits" exact>
                    <BadHabitsPage />
                </Route>
                <Route path="/NewHabits" exact>
                    <NewHabitsPage />
                </Route>
                <Route path="/NewHabits/detail/:id" exact>
                    <NewHabitDetailPage />
                </Route>
                <Route path="/Tasks" exact>
                    <TasksPage />
                </Route>
                <Redirect to="/"/>
            </Switch>
        )
    }

    return(
        <Switch>
            <Route path="/auth" exact>
                <AuthPage />
            </Route>
            <Redirect to="/auth" />
        </Switch>
    )
}