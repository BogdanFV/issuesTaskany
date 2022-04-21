import { useCallback, useEffect, useState } from 'react';
import { useRouter as useNextRouter } from 'next/router';
import tinykeys from 'tinykeys';

import { routes, useRouter } from '../hooks/router';
import { createProjectKeys, createHotkeys } from '../utils/hotkeys';
import { DialogModal } from './DialogModal';
import { ProjectCreateForm } from './ProjectCreateForm';

export const ProjectCreateModal = () => {
    const nextRouter = useNextRouter();
    const router = useRouter();
    const [modalVisible, setModalVisibility] = useState(false);
    const isCreateProjectPath = nextRouter.pathname === routes.createProject();
    const showModalOrNavigate = (navigate: () => void) => (isCreateProjectPath ? navigate() : setModalVisibility(true));
    const onModalClose = useCallback(() => setModalVisibility(false), [setModalVisibility]);

    useEffect(() =>
        tinykeys(window, createHotkeys([createProjectKeys, () => showModalOrNavigate(router.createProject)])),
    );

    return (
        <DialogModal visible={modalVisible} onClose={onModalClose}>
            <ProjectCreateForm onCreate={(slug) => slug && router.project(slug)} />
        </DialogModal>
    );
};