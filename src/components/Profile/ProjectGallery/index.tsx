import { useState, useEffect } from 'react';
import ProjectCard from '../ProjectCard/index';
import axios from 'axios';

const ProjectGallery = ({ userId, onProjectsLoaded, setIsLoadingChild }: any) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${userId}`);

        const data = response.data;
        setProjects(data);

        if (onProjectsLoaded) {
          onProjectsLoaded(data ? data.length : null);
        }
      } catch (err: any) {
        console.error("Erro ao buscar projetos:", err);
        setError(err.message);
      } finally {
        setLoading(false);

        if (setIsLoadingChild) {
          setIsLoadingChild(false);
        }
      }
    };

    if (userId) fetchProjects();
  }, [userId]);

  if (loading) return null;

  return (
    <div className="w-full">
      <div className="w-full mb-[20px] pt-[8px] px-[20px] md:px-[30px] lg:px-[40px] xl:px-[70px]">
        <div className="w-full mb-8">
          <h3 className="text-3xl font-medium text-black text-left">
            Meus Projetos
          </h3>
        </div>

        {projects?.length == 0 || error ? (
          <div className="bg-blue-50 border-l-4 border-[#4A4A4A] p-4 rounded text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#4A4A4A]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-[#4A4A4A]">
                  Você ainda não possui projetos cadastrados.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects?.map((project: any) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGallery;